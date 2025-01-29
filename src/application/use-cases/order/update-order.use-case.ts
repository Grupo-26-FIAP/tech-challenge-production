import {
  IOrderService,
  IOrderServiceSymbol,
} from '@Domain/services/order/order.service';
import { MessageProducer } from '@Infrastructure/queue/producer/producer.service';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateOrderRequestDto } from '../../dtos/request/order/update-order.request.dto';

@Injectable()
export class UpdateOrderUseCase {
  constructor(
    @Inject(IOrderServiceSymbol)
    private readonly service: IOrderService,
    private readonly producer: MessageProducer,
  ) {}

  async execute(dto: UpdateOrderRequestDto): Promise<void> {
    await this.service.update(dto.id, dto.orderStatus);
    await this.producer.sendMessage(
      'production-status-updated-queue.fifo',
      dto,
    );
  }
}
