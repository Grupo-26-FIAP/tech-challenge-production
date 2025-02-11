import { OrderItemEntity } from '@Domain/entities/order.entity';
import { OrderItemMapper } from '@Infrastructure/typeorm/mappers/order-item.mapper';
import { OrderItemModel } from '@Infrastructure/typeorm/models/order-item.model';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemRepositoryImpl } from '../src/infrastructure/repositories/order-item.repository.impl';

describe('OrderItemRepositoryImpl', () => {
  let repository: OrderItemRepositoryImpl;
  let orderItemRepository: Repository<OrderItemModel>;

  const mockOrderItemModel = new OrderItemModel();
  const mockOrderItemEntity = new OrderItemEntity(1, 1, new Date(), 1);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemRepositoryImpl,
        {
          provide: getRepositoryToken(OrderItemModel),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<OrderItemRepositoryImpl>(OrderItemRepositoryImpl);
    orderItemRepository = module.get<Repository<OrderItemModel>>(
      getRepositoryToken(OrderItemModel),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save an order item successfully', async () => {
      jest
        .spyOn(orderItemRepository, 'save')
        .mockResolvedValue(mockOrderItemModel);
      jest
        .spyOn(OrderItemMapper, 'toModel')
        .mockReturnValue(mockOrderItemModel);
      jest
        .spyOn(OrderItemMapper, 'toEntity')
        .mockReturnValue(mockOrderItemEntity);

      const result = await repository.save(mockOrderItemEntity);

      expect(result).toEqual(mockOrderItemEntity);
      expect(orderItemRepository.save).toHaveBeenCalledWith(mockOrderItemModel);
    });

    it('should throw an error if save fails', async () => {
      jest
        .spyOn(orderItemRepository, 'save')
        .mockRejectedValue(new Error('Save failed'));

      await expect(repository.save(mockOrderItemEntity)).rejects.toThrow(
        'Save failed',
      );
    });
  });

  describe('update', () => {
    it('should update an order item successfully', async () => {
      jest
        .spyOn(orderItemRepository, 'preload')
        .mockResolvedValue(mockOrderItemModel);
      jest
        .spyOn(orderItemRepository, 'save')
        .mockResolvedValue(mockOrderItemModel);
      jest
        .spyOn(OrderItemMapper, 'toModel')
        .mockReturnValue(mockOrderItemModel);
      jest
        .spyOn(OrderItemMapper, 'toEntity')
        .mockReturnValue(mockOrderItemEntity);

      const result = await repository.update(1, mockOrderItemEntity);

      expect(result).toEqual(mockOrderItemEntity);
      expect(orderItemRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...mockOrderItemModel,
      });
      expect(orderItemRepository.save).toHaveBeenCalledWith(mockOrderItemModel);
    });

    it('should return null if order item not found', async () => {
      jest.spyOn(orderItemRepository, 'preload').mockResolvedValue(null);

      const result = await repository.update(1, mockOrderItemEntity);

      expect(result).toBeNull();
    });

    it('should throw an error if update fails', async () => {
      jest
        .spyOn(orderItemRepository, 'preload')
        .mockRejectedValue(new Error('Update failed'));

      await expect(repository.update(1, mockOrderItemEntity)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('delete', () => {
    it('should delete an order item successfully', async () => {
      jest
        .spyOn(orderItemRepository, 'softDelete')
        .mockResolvedValue(undefined);

      await expect(repository.delete(1)).resolves.toBeUndefined();
      expect(orderItemRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw an error if delete fails', async () => {
      jest
        .spyOn(orderItemRepository, 'softDelete')
        .mockRejectedValue(new Error('Delete failed'));

      await expect(repository.delete(1)).rejects.toThrow('Delete failed');
    });
  });

  describe('findAll', () => {
    it('should find all order items successfully', async () => {
      jest
        .spyOn(orderItemRepository, 'find')
        .mockResolvedValue([mockOrderItemModel]);
      jest
        .spyOn(OrderItemMapper, 'toEntity')
        .mockReturnValue(mockOrderItemEntity);

      const result = await repository.findAll();

      expect(result).toEqual([mockOrderItemEntity]);
      expect(orderItemRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if findAll fails', async () => {
      jest
        .spyOn(orderItemRepository, 'find')
        .mockRejectedValue(new Error('Find all failed'));

      await expect(repository.findAll()).rejects.toThrow('Find all failed');
    });
  });

  describe('findById', () => {
    it('should find an order item by id successfully', async () => {
      jest
        .spyOn(orderItemRepository, 'findOne')
        .mockResolvedValue(mockOrderItemModel);
      jest
        .spyOn(OrderItemMapper, 'toEntity')
        .mockReturnValue(mockOrderItemEntity);

      const result = await repository.findById(1);

      expect(result).toEqual(mockOrderItemEntity);
      expect(orderItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if order item not found', async () => {
      jest.spyOn(orderItemRepository, 'findOne').mockResolvedValue(null);

      const result = await repository.findById(1);

      expect(result).toBeNull();
    });

    it('should throw an error if findById fails', async () => {
      jest
        .spyOn(orderItemRepository, 'findOne')
        .mockRejectedValue(new Error('Find by id failed'));

      await expect(repository.findById(1)).rejects.toThrow('Find by id failed');
    });
  });
});
