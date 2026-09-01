import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { Conversation } from '../../domain/entities/conversation.entity';
export declare class CreateGroupConversationUseCase {
    private readonly conversationRepository;
    private readonly messageRepository;
    private readonly messageBus;
    constructor(conversationRepository: ConversationRepository, messageRepository: MessageRepository, messageBus: MessageBusPublisher);
    execute(params: {
        creatorId: string;
        name: string;
        memberIds: string[];
    }): Promise<Conversation>;
}
