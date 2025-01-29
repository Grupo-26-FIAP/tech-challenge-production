import { OrderStatusType } from '@Shared/enums/order-status-type.enum';

export class OrderEntity {
  constructor(
    public orderStatus: OrderStatusType,
    public createdAt: Date,
    public preparationTime: number,
    public productsOrder: OrderItemEntity[],
    public userId?: number,
    public id?: number,
    public updatedAt?: Date,
  ) {}
}

export class OrderItemEntity {
  constructor(
    public quantity: number,
    public productId: number,
    public createdAt: Date,
    public id?: number,
  ) {}
}
