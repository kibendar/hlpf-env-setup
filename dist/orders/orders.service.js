"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const product_entity_1 = require("../products/product.entity");
const order_status_enum_1 = require("../common/enums/order-status.enum");
const role_enum_1 = require("../common/enums/role.enum");
const ALLOWED_TRANSITIONS = {
    [order_status_enum_1.OrderStatus.PENDING]: [order_status_enum_1.OrderStatus.CONFIRMED, order_status_enum_1.OrderStatus.CANCELLED],
    [order_status_enum_1.OrderStatus.CONFIRMED]: [order_status_enum_1.OrderStatus.SHIPPED, order_status_enum_1.OrderStatus.CANCELLED],
    [order_status_enum_1.OrderStatus.SHIPPED]: [order_status_enum_1.OrderStatus.DELIVERED],
    [order_status_enum_1.OrderStatus.DELIVERED]: [],
    [order_status_enum_1.OrderStatus.CANCELLED]: [],
};
let OrdersService = class OrdersService {
    orderRepo;
    productRepo;
    dataSource;
    cacheManager;
    constructor(orderRepo, productRepo, dataSource, cacheManager) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.dataSource = dataSource;
        this.cacheManager = cacheManager;
    }
    async create(dto, userId) {
        const qr = this.dataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();
        try {
            let totalPrice = 0;
            const orderItems = [];
            for (const item of dto.items) {
                const product = await qr.manager.findOne(product_entity_1.Product, { where: { id: item.productId } });
                if (!product) {
                    throw new common_1.NotFoundException(`Product #${item.productId} not found`);
                }
                if (product.stock < item.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for "${product.name}": available ${product.stock}, requested ${item.quantity}`);
                }
                product.stock -= item.quantity;
                await qr.manager.save(product);
                const orderItem = qr.manager.create(order_item_entity_1.OrderItem, {
                    product,
                    quantity: item.quantity,
                    price: product.price,
                });
                orderItems.push(orderItem);
                totalPrice += Number(product.price) * item.quantity;
            }
            const order = qr.manager.create(order_entity_1.Order, {
                user: { id: userId },
                items: orderItems,
                totalPrice,
                status: order_status_enum_1.OrderStatus.PENDING,
            });
            const saved = await qr.manager.save(order);
            await qr.commitTransaction();
            await this.clearProductsCache();
            return saved;
        }
        catch (error) {
            await qr.rollbackTransaction();
            throw error;
        }
        finally {
            await qr.release();
        }
    }
    async findAll(query, userId, userRole) {
        const { page = 1, pageSize = 10, status } = query;
        const qb = this.orderRepo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'item')
            .leftJoinAndSelect('item.product', 'product');
        if (userRole !== role_enum_1.Role.ADMIN) {
            qb.andWhere('order.userId = :userId', { userId });
        }
        if (status) {
            qb.andWhere('order.status = :status', { status });
        }
        qb.orderBy('order.createdAt', 'DESC');
        const skip = (page - 1) * pageSize;
        qb.skip(skip).take(pageSize);
        const [items, total] = await qb.getManyAndCount();
        return {
            items,
            meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
        };
    }
    async findOne(id, userId, userRole) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['items', 'items.product', 'user'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order #${id} not found`);
        }
        if (userRole !== role_enum_1.Role.ADMIN && order.user.id !== userId) {
            throw new common_1.ForbiddenException('You can only view your own orders');
        }
        return order;
    }
    async updateStatus(id, dto) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['items', 'items.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order #${id} not found`);
        }
        const allowed = ALLOWED_TRANSITIONS[order.status];
        if (!allowed.includes(dto.status)) {
            throw new common_1.BadRequestException(`Cannot transition from "${order.status}" to "${dto.status}"`);
        }
        if (dto.status === order_status_enum_1.OrderStatus.CANCELLED) {
            const qr = this.dataSource.createQueryRunner();
            await qr.connect();
            await qr.startTransaction();
            try {
                for (const item of order.items) {
                    const product = await qr.manager.findOne(product_entity_1.Product, { where: { id: item.product.id } });
                    if (product) {
                        product.stock += item.quantity;
                        await qr.manager.save(product);
                    }
                }
                order.status = dto.status;
                const saved = await qr.manager.save(order);
                await qr.commitTransaction();
                await this.clearProductsCache();
                return saved;
            }
            catch (error) {
                await qr.rollbackTransaction();
                throw error;
            }
            finally {
                await qr.release();
            }
        }
        order.status = dto.status;
        return this.orderRepo.save(order);
    }
    async remove(id) {
        const order = await this.orderRepo.findOne({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException(`Order #${id} not found`);
        }
        await this.orderRepo.remove(order);
    }
    async clearProductsCache() {
        await this.cacheManager.clear();
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource, Object])
], OrdersService);
//# sourceMappingURL=orders.service.js.map