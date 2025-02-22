import { ConsumerModule } from '@Infrastructure/queue/consumer/consumer.module';
import { ProducerModule } from '@Infrastructure/queue/producer/producer.module';
import { PostgresConfigService } from '@Infrastructure/typeorm/config/postgres.config.service';
import { OrderItemModel } from '@Infrastructure/typeorm/models/order-item.model';
import { OrderModel } from '@Infrastructure/typeorm/models/order.model';
import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentVariableModule } from '@Shared/config/environment-variable/environment-variable.module';
import { ResponseMiddleware } from '@Shared/middlewares/response.middleware';
import { FindAllOrdersUseCase } from './application/use-cases/order/find-all-orders.use-case';
import { FindOrderByIdUseCase } from './application/use-cases/order/find-order-by-id.use-case';
import { UpdateOrderUseCase } from './application/use-cases/order/update-order.use-case';
import { IOrderItemRepositorySymbol } from './domain/repositories/order-item.repository';
import { IOrderRepositorySymbol } from './domain/repositories/order.repository';
import { IOrderServiceSymbol } from './domain/services/order/order.service';
import { OrderServiceImpl } from './domain/services/order/order.service.impl';
import { OrderItemRepositoryImpl } from './infrastructure/repositories/order-item.repository.impl';
import { OrderRepositoryImpl } from './infrastructure/repositories/order.repository.impl';
import { HealthController } from './presentation/controllers/health.controller';
import { OrderController } from './presentation/controllers/order.controller';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({}),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    TypeOrmModule.forFeature([OrderModel, OrderItemModel]),
    EnvironmentVariableModule.forRoot({ isGlobal: true }),
    TerminusModule,
    ProducerModule,
    ConsumerModule,
  ],
  providers: [
    OrderServiceImpl,
    UpdateOrderUseCase,
    FindOrderByIdUseCase,
    FindAllOrdersUseCase,
    {
      provide: IOrderRepositorySymbol,
      useClass: OrderRepositoryImpl,
    },
    {
      provide: IOrderServiceSymbol,
      useClass: OrderServiceImpl,
    },
    {
      provide: IOrderItemRepositorySymbol,
      useClass: OrderItemRepositoryImpl,
    },
  ],
  controllers: [OrderController, HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ResponseMiddleware).forRoutes('*'); // Apply the middleware to all routes
  }
}
