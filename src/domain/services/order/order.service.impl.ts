import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderEntity } from '../../entities/order.entity';

import {
  IOrderItemRepository,
  IOrderItemRepositorySymbol,
} from '@Domain/repositories/order-item.repository';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import {
  IOrderRepository,
  IOrderRepositorySymbol,
} from '../../repositories/order.repository';
import { IOrderService } from './order.service';

@Injectable()
export class OrderServiceImpl implements IOrderService {
  constructor(
    @Inject(IOrderRepositorySymbol)
    private readonly repository: IOrderRepository,
    @Inject(IOrderItemRepositorySymbol)
    private readonly orderItemRepository: IOrderItemRepository,
  ) {}

  async update(id: number, orderStatus: OrderStatusType): Promise<void> {
    const order = await this.repository.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    const previousStatus = order.orderStatus;
    order.orderStatus = orderStatus;

    if (
      previousStatus !== orderStatus &&
      previousStatus === OrderStatusType.IN_PREPARATION &&
      orderStatus === OrderStatusType.READY
    ) {
      const now = new Date();
      const preparationDuration = now.getTime() - order.updatedAt.getTime();
      order.preparationTime = Math.ceil(preparationDuration / 1000 / 60);
    }

    this.repository.save(order);
  }

  async findOrderById(id: number): Promise<OrderEntity> {
    return this.repository.findById(id);
  }

  async findAllOrders(): Promise<OrderEntity[]> {
    return this.repository.findAll();
  }

  async createOrder(order: OrderEntity): Promise<void> {
    await this.repository.save(order);
  }
}
