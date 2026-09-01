import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';
export type DeleteScope = 'ME' | 'EVERYONE';
export declare class DeleteMessageUseCase {
    private readonly conversationRepository;
    private readonly messageRepository;
    private readonly messageBus;
    constructor(conversationRepository: ConversationRepository, messageRepository: MessageRepository, messageBus: MessageBusPublisher);
    execute(params: {
        messageId: string;
        requesterId: string;
        scope: DeleteScope;
    }): Promise<void>;
}
