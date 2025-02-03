import { CreateOrderUseCase } from '@Application/use-cases/order/create-order.use-case';
import { OrderEntity } from '@Domain/entities/order.entity';
import { Inject, Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';

@Injectable()
export class MessageHandler {
  private sqs: AWS.SQS;
  constructor(
    @Inject(CreateOrderUseCase)
    private readonly createOrderUseCase: CreateOrderUseCase,
  ) {
    this.sqs = new AWS.SQS();
  }

  @SqsMessageHandler(process.env.ORDER_QUEUE_NAME, false)
  async handleMessage(message: AWS.SQS.Message) {
    const data = JSON.parse(message.Body) as OrderEntity;

    console.log({ message: data });

    await this.createOrderUseCase.execute(data);

    await this.sqs
      .deleteMessage({
        QueueUrl: process.env.ORDER_QUEUE_URL,
        ReceiptHandle: message.ReceiptHandle,
      })
      .promise()
      .catch((error) => {
        console.log(error);
      });
  }
}
