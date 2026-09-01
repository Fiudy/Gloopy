import { Conversation } from '../../domain/entities/conversation.entity';
export interface ConversationResponse {
    id: string;
    type: string;
    name: string | null;
    avatarUrl: string | null;
    isPending: boolean;
    participants: {
        userId: string;
        role: string;
    }[];
}
export declare function toConversationResponse(conversation: Conversation): ConversationResponse;
