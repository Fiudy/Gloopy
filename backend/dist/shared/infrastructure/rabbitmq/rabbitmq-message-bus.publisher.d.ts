import { BusEvent, MessageBusPublisher } from '@shared/application/message-bus.port';
import { RabbitMqService } from './rabbitmq.service';
export declare class RabbitMqMessageBusPublisher implements MessageBusPublisher {
    private readonly rabbitMq;
    constructor(rabbitMq: RabbitMqService);
    publishToUser(userId: string, event: BusEvent): Promise<void>;
    publishToConversation(conversationId: string, event: BusEvent): Promise<void>;
    private publish;
}
