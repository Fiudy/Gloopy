import { Injectable } from '@nestjs/common';
import { BusEvent, MessageBusPublisher } from '@shared/application/message-bus.port';
import { RabbitMqService, EVENTS_EXCHANGE } from './rabbitmq.service';

const userRoutingKey = (userId: string) => `user.${userId}`;
const conversationRoutingKey = (conversationId: string) => `conversation.${conversationId}`;

@Injectable()
export class RabbitMqMessageBusPublisher implements MessageBusPublisher {
  constructor(private readonly rabbitMq: RabbitMqService) {}

  async publishToUser(userId: string, event: BusEvent): Promise<void> {
    await this.publish(userRoutingKey(userId), event);
  }

  async publishToConversation(conversationId: string, event: BusEvent): Promise<void> {
    await this.publish(conversationRoutingKey(conversationId), event);
  }

  private async publish(routingKey: string, event: BusEvent): Promise<void> {
    const channel = await this.rabbitMq.getChannel();
    channel.publish(EVENTS_EXCHANGE, routingKey, Buffer.from(JSON.stringify(event)), {
      persistent: false, // eventos de tempo real - se ninguém está ouvindo, descarta (não é fila de persistência)
      contentType: 'application/json',
    });
  }
}
