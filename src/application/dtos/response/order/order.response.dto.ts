import { OrderItemEntity } from '@Domain/entities/order-item.entity';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';

export class OrderResponseDto {
  @ApiProperty({
    description: 'ID do pedido.',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Usuário que fez o pedido.',
  })
  user?: number;

  @ApiProperty({
    description: 'Status do pedido.',
    example: 'none',
  })
  orderStatus: OrderStatusType;

  @ApiProperty({
    description: 'Data de criação do pedido.',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do pedido.',
    example: '2024-01-02T00:00:00Z',
    required: false,
  })
  updatedAt?: Date;

  @ApiProperty({
    description: 'Lista de produtos e quantidades no pedido.',
    type: [OrderItemEntity],
    example: [{ productId: 1, quantity: 2 }],
  })
  productOrders: OrderItemEntity[];
}
