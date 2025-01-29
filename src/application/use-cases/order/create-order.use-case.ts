import { OrderEntity } from '@Domain/entities/order.entity';
import {
  IOrderService,
  IOrderServiceSymbol,
} from '@Domain/services/order/order.service';
import { MessageProducer } from '@Infrastructure/queue/producer/producer.service';
import { Inject, Injectable } from '@nestjs/common';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(IOrderServiceSymbol)
    private readonly service: IOrderService,
    private readonly messageProducer: MessageProducer,
  ) {}

  async execute(orderEntityRequest: OrderEntity): Promise<void> {
    console.log(orderEntityRequest);

    await this.service.createOrder(orderEntityRequest);

    await this.messageProducer.sendMessage(
      'production-status-updated-queue.fifo',
      {
        orderId: orderEntityRequest.id,
        orderStatus: OrderStatusType.RECEIVED,
      },
    );
  }
}
