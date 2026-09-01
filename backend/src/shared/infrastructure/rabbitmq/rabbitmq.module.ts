import { Global, Module } from '@nestjs/common';
import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { RabbitMqService } from './rabbitmq.service';
import { RabbitMqMessageBusPublisher } from './rabbitmq-message-bus.publisher';

@Global()
@Module({
  providers: [
    RabbitMqService,
    { provide: MessageBusPublisher, useClass: RabbitMqMessageBusPublisher },
  ],
  exports: [RabbitMqService, MessageBusPublisher],
})
export class RabbitMqModule {}
