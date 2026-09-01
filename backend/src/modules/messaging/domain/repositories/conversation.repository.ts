import { Conversation } from '../entities/conversation.entity';

export abstract class ConversationRepository {
  abstract findById(id: string): Promise<Conversation | null>;
  abstract findDirectBetween(userAId: string, userBId: string): Promise<Conversation | null>;
  abstract findAllForUser(userId: string): Promise<Conversation[]>;
  abstract save(conversation: Conversation): Promise<void>;
}
