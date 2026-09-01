import { Conversation } from '../../domain/entities/conversation.entity';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
export declare function loadConversationForSending(conversationRepository: ConversationRepository, params: {
    conversationId: string;
    senderId: string;
}): Promise<Conversation>;
