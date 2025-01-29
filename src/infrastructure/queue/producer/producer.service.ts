import { Injectable } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MessageProducer {
  constructor(private readonly sqsService: SqsService) {}
  async sendMessage(queue: string, body: any) {
    const message: any = JSON.stringify(body);

    try {
      await this.sqsService.send(queue, {
        id: uuidv4(),
        groupId: uuidv4(),
        body: message,
        delaySeconds: 0,
      });
    } catch (error) {
      console.log('error in producing image!', error);
    }
  }
}
