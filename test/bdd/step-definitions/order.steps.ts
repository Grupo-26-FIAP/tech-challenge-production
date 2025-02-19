import { FindAllOrdersUseCase } from '@Application/use-cases/order/find-all-orders.use-case';
import { FindOrderByIdUseCase } from '@Application/use-cases/order/find-order-by-id.use-case';
import { UpdateOrderUseCase } from '@Application/use-cases/order/update-order.use-case';
import { Given, Then, When } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { OrderController } from '@Presentation/controllers/order.controller';
import { strict as assert } from 'assert';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';

let app: INestApplication;
let response: request.Response;

const mockOrder = {
  execute: async () => {},
};

Given('the system is running', async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
    controllers: [OrderController],
    providers: [
      { provide: FindOrderByIdUseCase, useValue: mockOrder },
      { provide: FindAllOrdersUseCase, useValue: mockOrder },
      { provide: UpdateOrderUseCase, useValue: mockOrder },
    ],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});

When(
  'I access the find order route with orderId {int}',
  async function (orderId: number) {
    response = await request(app.getHttpServer()).get(`/orders/${orderId}`);
  },
);

Then(
  'the system should return the order with the expected details and HTTP code 200',
  () => {
    assert.strictEqual(response.status, 200);
    assert.deepEqual(response.body, {});
  },
);
