import { OrderEntity } from '@Domain/entities/order.entity';
import {
  IOrderService,
  IOrderServiceSymbol,
} from '@Domain/services/order/order.service';
import { MessageProducer } from '@Infrastructure/queue/producer/producer.service';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { CreateOrderUseCase } from './create-order.use-case';

describe('CreateOrderUseCase', () => {
  let createOrderUseCase: CreateOrderUseCase;
  let orderService: IOrderService;
  let messageProducer: MessageProducer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderUseCase,
        {
          provide: IOrderServiceSymbol,
          useValue: {
            createOrder: jest.fn(),
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

    createOrderUseCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
    orderService = module.get<IOrderService>(IOrderServiceSymbol);
    messageProducer = module.get<MessageProducer>(MessageProducer);
  });

  it('should create an order and send a message successfully', async () => {
    const orderEntityRequest: OrderEntity = {
      orderStatus: OrderStatusType.RECEIVED,
      createdAt: new Date(),
      preparationTime: 0,
      productsOrder: [],
    } as OrderEntity;

    await createOrderUseCase.execute(orderEntityRequest);

    expect(orderService.createOrder).toHaveBeenCalledWith(orderEntityRequest);
    expect(messageProducer.sendMessage).toHaveBeenCalledWith(
      'production-status-updated-queue.fifo',
      {
        orderId: orderEntityRequest.id,
        orderStatus: OrderStatusType.RECEIVED,
      },
    );
  });

  it('should throw an error if order creation fails', async () => {
    const orderEntityRequest: OrderEntity = {
      orderStatus: OrderStatusType.RECEIVED,
      createdAt: new Date(),
      preparationTime: 0,
      productsOrder: [],
    } as OrderEntity;

    (orderService.createOrder as jest.Mock).mockRejectedValue(
      new Error('Order creation failed'),
    );

    await expect(
      createOrderUseCase.execute(orderEntityRequest),
    ).rejects.toThrow('Order creation failed');
    expect(orderService.createOrder).toHaveBeenCalledWith(orderEntityRequest);
    expect(messageProducer.sendMessage).not.toHaveBeenCalled();
  });

  it('should throw an error if message sending fails', async () => {
    const orderEntityRequest: OrderEntity = {
      orderStatus: OrderStatusType.RECEIVED,
      createdAt: new Date(),
      preparationTime: 0,
      productsOrder: [],
    } as OrderEntity;

    (messageProducer.sendMessage as jest.Mock).mockRejectedValue(
      new Error('Message sending failed'),
    );

    await expect(
      createOrderUseCase.execute(orderEntityRequest),
    ).rejects.toThrow('Message sending failed');
    expect(orderService.createOrder).toHaveBeenCalledWith(orderEntityRequest);
    expect(messageProducer.sendMessage).toHaveBeenCalledWith(
      'production-status-updated-queue.fifo',
      {
        orderId: orderEntityRequest.id,
        orderStatus: OrderStatusType.RECEIVED,
      },
    );
  });
});
