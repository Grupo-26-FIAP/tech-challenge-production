import { OrderEntity } from '@Domain/entities/order.entity';
import { OrderItemMapper } from '@Infrastructure/typeorm/mappers/order-item.mapper';
import { OrderResponseDto } from '../dtos/response/order/order.response.dto';

export class OrderMapper {
  static toResponseDto(orderEntity: OrderEntity): OrderResponseDto {
    const productOrders = orderEntity.productsOrder?.map(
      OrderItemMapper.toEntity,
    );

    return {
      id: orderEntity.id,
      user: orderEntity.userId,
      orderStatus: orderEntity.orderStatus,
      createdAt: orderEntity.createdAt,
      updatedAt: orderEntity.updatedAt,
      productOrders: productOrders,
    };
  }
}
