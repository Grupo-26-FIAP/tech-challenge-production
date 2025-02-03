import { OrderEntity } from '@Domain/entities/order.entity';
import { IOrderRepository } from '@Domain/repositories/order.repository';
import { OrderMapper } from '@Infrastructure/typeorm/mappers/order.mapper';
import { OrderModel } from '@Infrastructure/typeorm/models/order.model';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { In, Repository } from 'typeorm';

export class OrderRepositoryImpl implements IOrderRepository {
  constructor(
    @InjectRepository(OrderModel)
    private readonly repository: Repository<OrderModel>,
  ) {}

  async save(order: OrderEntity): Promise<OrderEntity> {
    const orderModel = OrderMapper.toModel(order);
    try {
      const savedModel = await this.repository.save(orderModel);
      return OrderMapper.toEntity(savedModel);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(id: number, order: OrderEntity): Promise<OrderEntity> {
    const orderModel = await this.repository.preload({
      id: id,
      ...OrderMapper.toModel(order),
    });
    if (!orderModel) return null;
    const updatedModel = await this.repository.save(orderModel);
    return OrderMapper.toEntity(updatedModel);
  }

  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  async findAll(): Promise<OrderEntity[]> {
    const orders = await this.repository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['OrderItems'],
      where: {
        orderStatus: In([
          OrderStatusType.RECEIVED,
          OrderStatusType.IN_PREPARATION,
          OrderStatusType.READY,
        ]),
      },
    });
    return orders.map(OrderMapper.toEntity);
  }

  async findById(id: number): Promise<OrderEntity> {
    const order = await this.repository.findOne({ where: { id } });
    if (!order) return null;
    return OrderMapper.toEntity(order);
  }
}
