import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { OrderEntity } from '../../entities/order.entity';
export interface IOrderService {
  createOrder(order: OrderEntity): Promise<void>;
  update(id: number, orderStatus: OrderStatusType): Promise<void>;
  findOrderById(id: number): Promise<OrderEntity>;
  findAllOrders(): Promise<OrderEntity[]>;
}

export const IOrderServiceSymbol = Symbol('IOrderService');
