import { OrderEntity } from '@Domain/entities/order.entity';
import {
  IOrderService,
  IOrderServiceSymbol,
} from '@Domain/services/order/order.service';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { OrderMapper } from '../../mappers/order.mapper';
import { FindAllOrdersUseCase } from './find-all-orders.use-case';

describe('FindAllOrdersUseCase', () => {
  let useCase: FindAllOrdersUseCase;
  let orderService: IOrderService;

  const mockOrderService = {
    findAllOrders: jest.fn(),
  };

  const mockOrderEntities: OrderEntity[] = [
    {
      id: 1,
      orderStatus: 'PENDING' as OrderStatusType,
      createdAt: new Date(),
      preparationTime: 10,
      productsOrder: [],
    },
    {
      id: 2,
      orderStatus: 'PENDING' as OrderStatusType,
      createdAt: new Date(),
      preparationTime: 10,
      productsOrder: [],
    },
  ];

  const mockOrderResponseDtos = mockOrderEntities.map(
    OrderMapper.toResponseDto,
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllOrdersUseCase,
        {
          provide: IOrderServiceSymbol,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    useCase = module.get<FindAllOrdersUseCase>(FindAllOrdersUseCase);
    orderService = module.get<IOrderService>(IOrderServiceSymbol);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return all orders successfully', async () => {
    mockOrderService.findAllOrders.mockResolvedValue(mockOrderEntities);

    const result = await useCase.execute();

    expect(result).toEqual(mockOrderResponseDtos);
    expect(orderService.findAllOrders).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if findAllOrders fails', async () => {
    mockOrderService.findAllOrders.mockClear();
    const error = new Error('Failed to fetch orders');
    mockOrderService.findAllOrders.mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow(error);
    expect(orderService.findAllOrders).toHaveBeenCalledTimes(1);
  });
});
