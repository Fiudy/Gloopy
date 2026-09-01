import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';
export declare class EditMessageUseCase {
    private readonly conversationRepository;
    private readonly messageRepository;
    private readonly messageBus;
    constructor(conversationRepository: ConversationRepository, messageRepository: MessageRepository, messageBus: MessageBusPublisher);
    execute(params: {
        messageId: string;
        requesterId: string;
        content: string;
    }): Promise<Message>;
}
