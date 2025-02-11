import { OrderResponseDto } from '@Application/dtos/response/order/order.response.dto';
import { OrderMapper } from '@Application/mappers/order.mapper';
import {
  IOrderService,
  IOrderServiceSymbol,
} from '@Domain/services/order/order.service';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { FindOrderByIdUseCase } from '../src/application/use-cases/order/find-order-by-id.use-case';

describe('FindOrderByIdUseCase', () => {
  let useCase: FindOrderByIdUseCase;
  let orderService: IOrderService;

  const mockOrderService = {
    findOrderById: jest.fn(),
  };

  const mockOrderEntity = {
    id: 1,
    item: 'item1',
    quantity: 1,
    orderStatus: 'PENDING' as OrderStatusType,
    createdAt: new Date(),
    preparationTime: 10,
    productsOrder: [],
  };
  const mockOrderResponseDto: OrderResponseDto = {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    productOrders: [],
    user: 1,
    orderStatus: 'PENDING' as OrderStatusType,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOrderByIdUseCase,
        {
          provide: IOrderServiceSymbol,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    useCase = module.get<FindOrderByIdUseCase>(FindOrderByIdUseCase);
    orderService = module.get<IOrderService>(IOrderServiceSymbol);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return an order response dto when order is found', async () => {
    jest
      .spyOn(orderService, 'findOrderById')
      .mockResolvedValue(mockOrderEntity);
    jest
      .spyOn(OrderMapper, 'toResponseDto')
      .mockReturnValue(mockOrderResponseDto);

    const result = await useCase.execute(1);

    expect(orderService.findOrderById).toHaveBeenCalledWith(1);
    expect(OrderMapper.toResponseDto).toHaveBeenCalledWith(mockOrderEntity);
    expect(result).toEqual(mockOrderResponseDto);
  });

  it('should throw an error when order is not found', async () => {
    jest
      .spyOn(orderService, 'findOrderById')
      .mockRejectedValue(new Error('Order not found'));

    await expect(useCase.execute(1)).rejects.toThrow('Order not found');
    expect(orderService.findOrderById).toHaveBeenCalledWith(1);
  });
});
