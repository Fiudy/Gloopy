import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { Conversation } from '../../domain/entities/conversation.entity';

@Injectable()
export class ListConversationsUseCase {
  constructor(private readonly conversationRepository: ConversationRepository) {}

  async execute(userId: string): Promise<Conversation[]> {
    return this.conversationRepository.findAllForUser(userId);
  }
}
