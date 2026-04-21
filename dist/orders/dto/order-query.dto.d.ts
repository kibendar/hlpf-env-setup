import { OrderStatus } from '../../common/enums/order-status.enum';
export declare class OrderQueryDto {
    page?: number;
    pageSize?: number;
    status?: OrderStatus;
}
