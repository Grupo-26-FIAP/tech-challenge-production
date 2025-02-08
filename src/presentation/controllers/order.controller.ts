import { UpdateOrderRequestDto } from '@Application/dtos/request/order/update-order.request.dto';
import { OrderResponseDto } from '@Application/dtos/response/order/order.response.dto';
import { FindAllOrdersUseCase } from '@Application/use-cases/order/find-all-orders.use-case';
import { FindOrderByIdUseCase } from '@Application/use-cases/order/find-order-by-id.use-case';
import { UpdateOrderUseCase } from '@Application/use-cases/order/update-order.use-case';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('/orders')
export class OrderController {
  constructor(
    private readonly findOrderByIdUseCase: FindOrderByIdUseCase,
    private readonly findAllOrdersUseCase: FindAllOrdersUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtém um pedido por ID' })
  @ApiOperation({ summary: 'Cancela um pedido' })
  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  @ApiResponse({
    status: 200,
    description: 'Pedido encontrado',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'ID inválido' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async findOrderById(@Param('id') id: number): Promise<OrderResponseDto> {
    return this.findOrderByIdUseCase.execute(id);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os pedidos' })
  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos',
    type: [OrderResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async findAllOrders(): Promise<OrderResponseDto[]> {
    return this.findAllOrdersUseCase.execute();
  }

  @Put()
  @ApiOperation({ summary: 'Atualiza o status do pedido' })
  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async update(@Body() dto: UpdateOrderRequestDto): Promise<void> {
    return this.updateOrderUseCase.execute(dto);
  }
}
