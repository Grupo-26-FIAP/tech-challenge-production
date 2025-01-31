import {
  IOrderItemRepository,
  IOrderItemRepositorySymbol,
} from '@Domain/repositories/order-item.repository';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { OrderEntity } from '../../entities/order.entity';
import {
  IOrderRepository,
  IOrderRepositorySymbol,
} from '../../repositories/order.repository';
import { OrderServiceImpl } from './order.service.impl';

describe('OrderServiceImpl', () => {
  let service: OrderServiceImpl;
  let orderRepository: IOrderRepository;
  let orderItemRepository: IOrderItemRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderServiceImpl,
        {
          provide: IOrderRepositorySymbol,
          useValue: {
            findById: jest.fn(),
            findAll: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: IOrderItemRepositorySymbol,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OrderServiceImpl>(OrderServiceImpl);
    orderRepository = module.get<IOrderRepository>(IOrderRepositorySymbol);
    orderItemRepository = module.get<IOrderItemRepository>(
      IOrderItemRepositorySymbol,
    );
  });

  describe('update', () => {
    it('should update the order status and preparation time', async () => {
      const order = new OrderEntity(
        OrderStatusType.IN_PREPARATION,
        new Date(),
        0,
        [],
        undefined,
        1,
        new Date(Date.now() - 60000),
      );

      jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(undefined);

      await service.update(1, OrderStatusType.READY);

      expect(orderRepository.findById).toHaveBeenCalledWith(1);
      expect(orderRepository.save).toHaveBeenCalledWith(order);
      expect(order.orderStatus).toBe(OrderStatusType.READY);
      expect(order.preparationTime).toBe(2);
    });

    it('should throw NotFoundException if order not found', async () => {
      jest.spyOn(orderRepository, 'findById').mockResolvedValue(null);

      await expect(service.update(1, OrderStatusType.READY)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOrderById', () => {
    it('should return the order if found', async () => {
      const order = new OrderEntity(
        OrderStatusType.IN_PREPARATION,
        new Date(),
        0,
        [],
        undefined,
        1,
        new Date(Date.now() - 60000),
      );
      order.id = 1;

      jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);

      const result = await service.findOrderById(1);

      expect(result).toBe(order);
      expect(orderRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should return null if order not found', async () => {
      jest.spyOn(orderRepository, 'findById').mockResolvedValue(null);

      const result = await service.findOrderById(1);

      expect(result).toBeNull();
      expect(orderRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('findAllOrders', () => {
    it('should return all orders', async () => {
      const orders = [
        new OrderEntity(
          OrderStatusType.IN_PREPARATION,
          new Date(),
          0,
          [],
          undefined,
          1,
          new Date(Date.now() - 60000),
        ),
        new OrderEntity(
          OrderStatusType.IN_PREPARATION,
          new Date(),
          0,
          [],
          undefined,
          1,
          new Date(Date.now() - 60000),
        ),
      ];

      jest.spyOn(orderRepository, 'findAll').mockResolvedValue(orders);

      const result = await service.findAllOrders();

      expect(result).toBe(orders);
      expect(orderRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('createOrder', () => {
    it('should save the order', async () => {
      const order = new OrderEntity(
        OrderStatusType.IN_PREPARATION,
        new Date(),
        0,
        [],
        undefined,
        1,
        new Date(Date.now() - 60000),
      );

      jest.spyOn(orderRepository, 'save').mockResolvedValue(undefined);

      await service.createOrder(order);

      expect(orderRepository.save).toHaveBeenCalledWith(order);
    });
  });
});
