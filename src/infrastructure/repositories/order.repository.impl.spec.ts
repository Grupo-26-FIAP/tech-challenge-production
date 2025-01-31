import { OrderEntity } from '@Domain/entities/order.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { PaymentStatusType } from '@Shared/enums/payment-status-type.enum';
import { Repository } from 'typeorm';
import { OrderMapper } from '../typeorm/mappers/order.mapper';
import { OrderModel } from '../typeorm/models/order.model';
import { OrderRepositoryImpl } from './order.repository.impl';

describe('OrderRepositoryImpl', () => {
  let repository: OrderRepositoryImpl;
  let orderRepository: Repository<OrderModel>;

  const orderEntity: OrderEntity = {
    id: 1,
    productsOrder: [],
    orderStatus: 'pending' as OrderStatusType,
    userId: 1,
    preparationTime: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const orderModel: OrderModel = {
    id: 1,
    estimatedPreparationTime: 10,
    OrderItems: [],
    orderStatus: 'pending' as OrderStatusType,
    paymentStatus: PaymentStatusType.PENDING,
    userId: 1,
    preparationTime: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRepositoryImpl,
        {
          provide: getRepositoryToken(OrderModel),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<OrderRepositoryImpl>(OrderRepositoryImpl);
    orderRepository = module.get<Repository<OrderModel>>(
      getRepositoryToken(OrderModel),
    );
  });

  it('should save an order successfully', async () => {
    jest.spyOn(orderRepository, 'save').mockResolvedValue(orderModel);
    jest.spyOn(OrderMapper, 'toModel').mockReturnValue(orderModel);
    jest.spyOn(OrderMapper, 'toEntity').mockReturnValue(orderEntity);

    const result = await repository.save(orderEntity);
    expect(result).toEqual(orderEntity);
  });

  it('should return null if save fails', async () => {
    jest
      .spyOn(orderRepository, 'save')
      .mockRejectedValue(new Error('Save failed'));

    const result = await repository.save(orderEntity);
    expect(result).toBeNull();
  });

  it('should update an order successfully', async () => {
    jest.spyOn(orderRepository, 'preload').mockResolvedValue(orderModel);
    jest.spyOn(orderRepository, 'save').mockResolvedValue(orderModel);
    jest.spyOn(OrderMapper, 'toModel').mockReturnValue(orderModel);
    jest.spyOn(OrderMapper, 'toEntity').mockReturnValue(orderEntity);

    const result = await repository.update(1, orderEntity);
    expect(result).toEqual(orderEntity);
  });

  it('should return null if update fails', async () => {
    jest.spyOn(orderRepository, 'preload').mockResolvedValue(null);

    const result = await repository.update(1, orderEntity);
    expect(result).toBeNull();
  });

  it('should delete an order successfully', async () => {
    jest
      .spyOn(orderRepository, 'softDelete')
      .mockRejectedValue(new Error('Delete failed'));

    await expect(repository.delete(1)).rejects.toThrow('Delete failed');
  });

  it('should find all orders successfully', async () => {
    jest.spyOn(orderRepository, 'find').mockResolvedValue([orderModel]);
    jest.spyOn(OrderMapper, 'toEntity').mockReturnValue(orderEntity);

    const result = await repository.findAll();
    expect(result).toEqual([orderEntity]);
  });

  it('should return an empty array if no orders found', async () => {
    jest.spyOn(orderRepository, 'find').mockResolvedValue([]);

    await expect(repository.findAll()).resolves.toEqual([]);
  });

  it('should find an order by id successfully', async () => {
    jest.spyOn(orderRepository, 'findOne').mockResolvedValue(orderModel);
    jest.spyOn(OrderMapper, 'toEntity').mockReturnValue(orderEntity);

    const result = await repository.findById(1);
    expect(result).toEqual(orderEntity);
  });

  it('should return null if order not found by id', async () => {
    jest.spyOn(orderRepository, 'findOne').mockResolvedValue(null);

    const result = await repository.findById(1);
    expect(result).toBeNull();
  });

  it('should handle errors in findById', async () => {
    jest.spyOn(orderRepository, 'findOne').mockResolvedValue(null);

    const result = await repository.findById(1);
    expect(result).toBeNull();
  });

  it('should handle errors in findAll', async () => {
    jest
      .spyOn(orderRepository, 'find')
      .mockRejectedValue(new Error('Find all failed'));

    try {
      await repository.findAll();
    } catch (error) {
      expect(error.message).toBe('Find all failed');
    }
  });

  it('should handle errors in delete', async () => {
    jest
      .spyOn(orderRepository, 'softDelete')
      .mockRejectedValue(new Error('Delete failed'));

    await expect(repository.delete(1)).rejects.toThrow('Delete failed');
  });
});
