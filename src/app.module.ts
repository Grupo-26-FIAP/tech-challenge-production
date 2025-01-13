import { PostgresConfigService } from '@Infrastructure/typeorm/config/postgres.config.service';

import { OrderModel } from '@Infrastructure/typeorm/models/order.model';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentVariableModule } from '@Shared/config/environment-variable/environment-variable.module';
import { ApproveOrderUseCase } from './application/use-cases/order/approve-order.use-case';
import { CancelOrderUseCase } from './application/use-cases/order/cancel-order.use-case';
import { CreateOrderUseCase } from './application/use-cases/order/create-order.use-case';
import { FindAllOrdersUseCase } from './application/use-cases/order/find-all-orders.use-case';
import { FindOrderByIdUseCase } from './application/use-cases/order/find-order-by-id.use-case';
import { UpdateOrderUseCase } from './application/use-cases/order/update-order.use-case';
import { IOrderRepositorySymbol } from './domain/repositories/order.repository';
import { IOrderServiceSymbol } from './domain/services/order/order.service';
import { OrderServiceImpl } from './domain/services/order/order.service.impl';
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
    TypeOrmModule.forFeature([OrderModel]),
    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => {
    //     const store = await redisStore({
    //       socket: {
    //         host: configService.get<string>('CACHE_SERVICE_HOST'),
    //         port: configService.get<number>('CACHE_SERVICE_PORT'),
    //       },
    //     });

    //     return {
    //       store: store as unknown as CacheStore,
    //     };
    //   },
    // }),

    EnvironmentVariableModule.forRoot({ isGlobal: true }),
    TerminusModule,
  ],
  providers: [
    OrderServiceImpl,
    CreateOrderUseCase,
    CancelOrderUseCase,
    UpdateOrderUseCase,
    ApproveOrderUseCase,
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
  ],
  controllers: [OrderController, HealthController],
})
export class AppModule {}
