import { Conversation } from '../../domain/entities/conversation.entity';

export interface ConversationResponse {
  id: string;
  type: string;
  name: string | null;
  avatarUrl: string | null;
  isPending: boolean; // true = "fulano quer falar com você" (DIRECT ainda não aceita)
  participants: { userId: string; role: string }[];
}

export function toConversationResponse(conversation: Conversation): ConversationResponse {
  return {
    id: conversation.id,
    type: conversation.type,
    name: conversation.name,
    avatarUrl: conversation.avatarUrl,
    isPending: conversation.isDirectPending,
    participants: conversation.activeParticipants.map((p) => ({ userId: p.userId, role: p.role })),
  };
}
