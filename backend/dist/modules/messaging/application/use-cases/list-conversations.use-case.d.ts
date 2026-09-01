import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { Conversation } from '../../domain/entities/conversation.entity';
export declare class ListConversationsUseCase {
    private readonly conversationRepository;
    constructor(conversationRepository: ConversationRepository);
    execute(userId: string): Promise<Conversation[]>;
}
