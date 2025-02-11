import { OrderEntity } from '@Domain/entities/order.entity';
import { OrderMapper } from '@Infrastructure/typeorm/mappers/order.mapper';
import { OrderModel } from '@Infrastructure/typeorm/models/order.model';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { Repository } from 'typeorm';
import { OrderRepositoryImpl } from '../src/infrastructure/repositories/order.repository.impl';

describe('OrderRepositoryImpl', () => {
  let repository: OrderRepositoryImpl;
  let orderRepository: Repository<OrderModel>;

  const mockOrderModel = new OrderModel();
  const mockOrderEntity = new OrderEntity(
    OrderStatusType.NONE,
    new Date(),
    10,
    [],
  );

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

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('update', () => {
    it('should update an order successfully', async () => {
      jest.spyOn(orderRepository, 'preload').mockResolvedValue(mockOrderModel);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(mockOrderModel);
      jest.spyOn(OrderMapper, 'toModel').mockReturnValue(mockOrderModel);
      jest.spyOn(OrderMapper, 'toEntity').mockReturnValue(mockOrderEntity);

      const result = await repository.update(1, mockOrderEntity);

      expect(result).toEqual(mockOrderEntity);
      expect(orderRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...mockOrderModel,
      });
      expect(orderRepository.save).toHaveBeenCalledWith(mockOrderModel);
    });

    it('should return null if order not found', async () => {
      jest.spyOn(orderRepository, 'preload').mockResolvedValue(null);

      const result = await repository.update(1, mockOrderEntity);

      expect(result).toBeNull();
    });

    it('should throw an error if update fails', async () => {
      jest
        .spyOn(orderRepository, 'preload')
        .mockRejectedValue(new Error('Update failed'));

      await expect(repository.update(1, mockOrderEntity)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('delete', () => {
    it('should delete an order successfully', async () => {
      jest.spyOn(orderRepository, 'softDelete').mockResolvedValue(undefined);

      await expect(repository.delete(1)).resolves.toBeUndefined();
      expect(orderRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw an error if delete fails', async () => {
      jest
        .spyOn(orderRepository, 'softDelete')
        .mockRejectedValue(new Error('Delete failed'));

      await expect(repository.delete(1)).rejects.toThrow('Delete failed');
    });
  });

  describe('findAll', () => {
    it('should find all orders successfully', async () => {
      jest.spyOn(orderRepository, 'find').mockResolvedValue([mockOrderModel]);
      jest.spyOn(OrderMapper, 'toEntity').mockReturnValue(mockOrderEntity);

      const result = await repository.findAll();

      expect(result).toEqual([mockOrderEntity]);
      expect(orderRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if findAll fails', async () => {
      jest
        .spyOn(orderRepository, 'find')
        .mockRejectedValue(new Error('Find all failed'));

      await expect(repository.findAll()).rejects.toThrow('Find all failed');
    });
  });

  describe('findById', () => {
    it('should find an order by id successfully', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(mockOrderModel);
      jest.spyOn(OrderMapper, 'toEntity').mockReturnValue(mockOrderEntity);

      const result = await repository.findById(1);

      expect(result).toEqual(mockOrderEntity);
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if order not found', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(null);

      const result = await repository.findById(1);

      expect(result).toBeNull();
    });

    it('should throw an error if findById fails', async () => {
      jest
        .spyOn(orderRepository, 'findOne')
        .mockRejectedValue(new Error('Find by id failed'));

      await expect(repository.findById(1)).rejects.toThrow('Find by id failed');
    });
  });
});
