import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';
export declare class ListMessagesUseCase {
    private readonly conversationRepository;
    private readonly messageRepository;
    constructor(conversationRepository: ConversationRepository, messageRepository: MessageRepository);
    execute(params: {
        conversationId: string;
        requesterId: string;
        before?: Date;
        limit?: number;
    }): Promise<Message[]>;
}
