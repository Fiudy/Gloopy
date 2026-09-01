import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { Conversation } from '../../domain/entities/conversation.entity';
export declare class CreateDirectConversationUseCase {
    private readonly conversationRepository;
    private readonly messageBus;
    constructor(conversationRepository: ConversationRepository, messageBus: MessageBusPublisher);
    execute(params: {
        initiatorId: string;
        recipientId: string;
    }): Promise<Conversation>;
}
