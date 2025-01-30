import {
  IOrderService,
  IOrderServiceSymbol,
} from '@Domain/services/order/order.service';
import { MessageProducer } from '@Infrastructure/queue/producer/producer.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateOrderRequestDto } from '../../dtos/request/order/update-order.request.dto';

import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { UpdateOrderUseCase } from './update-order.use-case';

describe('UpdateOrderUseCase', () => {
  let updateOrderUseCase: UpdateOrderUseCase;
  let orderService: IOrderService;
  let messageProducer: MessageProducer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateOrderUseCase,
        {
          provide: IOrderServiceSymbol,
          useValue: {
            update: jest.fn(),
          },
        },
        {
          provide: MessageProducer,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    updateOrderUseCase = module.get<UpdateOrderUseCase>(UpdateOrderUseCase);
    orderService = module.get<IOrderService>(IOrderServiceSymbol);
    messageProducer = module.get<MessageProducer>(MessageProducer);
  });

  it('should be defined', () => {
    expect(updateOrderUseCase).toBeDefined();
  });

  it('should update order and send message successfully', async () => {
    const dto: UpdateOrderRequestDto = {
      id: 1,
      orderStatus: OrderStatusType.READY,
    };

    await updateOrderUseCase.execute(dto);

    expect(orderService.update).toHaveBeenCalledWith(dto.id, dto.orderStatus);
    expect(messageProducer.sendMessage).toHaveBeenCalledWith(
      'production-status-updated-queue.fifo',
      dto,
    );
  });

  it('should throw an error if order update fails', async () => {
    const dto: UpdateOrderRequestDto = {
      id: 1,
      orderStatus: OrderStatusType.READY,
    };
    (orderService.update as jest.Mock).mockRejectedValue(
      new Error('Update failed'),
    );

    await expect(updateOrderUseCase.execute(dto)).rejects.toThrow(
      'Update failed',
    );
    expect(orderService.update).toHaveBeenCalledWith(dto.id, dto.orderStatus);
    expect(messageProducer.sendMessage).not.toHaveBeenCalled();
  });

  it('should throw an error if message sending fails', async () => {
    const dto: UpdateOrderRequestDto = {
      id: 1,
      orderStatus: OrderStatusType.NONE,
    };
    (messageProducer.sendMessage as jest.Mock).mockRejectedValue(
      new Error('Message sending failed'),
    );

    await expect(updateOrderUseCase.execute(dto)).rejects.toThrow(
      'Message sending failed',
    );
    expect(orderService.update).toHaveBeenCalledWith(dto.id, dto.orderStatus);
    expect(messageProducer.sendMessage).toHaveBeenCalledWith(
      'production-status-updated-queue.fifo',
      dto,
    );
  });
});
