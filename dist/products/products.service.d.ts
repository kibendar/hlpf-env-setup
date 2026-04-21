import { Repository } from 'typeorm';
import type { Cache } from 'cache-manager';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
export declare class ProductsService {
    private readonly productRepo;
    private readonly cacheManager;
    constructor(productRepo: Repository<Product>, cacheManager: Cache);
    findAll(query: ProductQueryDto): Promise<{}>;
    findOne(id: number): Promise<Product>;
    create(dto: CreateProductDto): Promise<Product>;
    update(id: number, dto: UpdateProductDto): Promise<Product>;
    remove(id: number): Promise<void>;
    clearProductsCache(): Promise<void>;
}
