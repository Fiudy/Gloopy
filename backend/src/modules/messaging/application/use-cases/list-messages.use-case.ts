import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';

const DEFAULT_PAGE_SIZE = 30;

@Injectable()
export class ListMessagesUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  async execute(params: {
    conversationId: string;
    requesterId: string;
    before?: Date;
    limit?: number;
  }): Promise<Message[]> {
    const conversation = await this.conversationRepository.findById(params.conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversa não encontrada.');
    }
    if (!conversation.isActiveMember(params.requesterId)) {
      throw new ForbiddenException('Você não faz parte desta conversa.');
    }

    const messages = await this.messageRepository.findByConversation(params.conversationId, {
      before: params.before,
      limit: params.limit ?? DEFAULT_PAGE_SIZE,
    });

    // Mensagens "apagadas para mim" pelo requisitante nunca voltam na listagem dele.
    return messages.filter((m) => !m.isDeletedFor(params.requesterId));
  }
}
