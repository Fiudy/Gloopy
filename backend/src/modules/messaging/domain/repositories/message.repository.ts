import { Message } from '../entities/message.entity';

export interface FindMessagesOptions {
  before?: Date; // paginação por cursor (createdAt da última mensagem carregada)
  limit: number;
}

export abstract class MessageRepository {
  abstract findById(id: string): Promise<Message | null>;
  abstract findByConversation(conversationId: string, options: FindMessagesOptions): Promise<Message[]>;
  abstract save(message: Message): Promise<void>;
  abstract markRead(messageId: string, userId: string): Promise<void>;
}
