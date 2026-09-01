import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { publishToUsers } from '@shared/application/publish-to-users.helper';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { Conversation } from '../../domain/entities/conversation.entity';

@Injectable()
export class CreateDirectConversationUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageBus: MessageBusPublisher,
  ) {}

  /**
   * Idempotente: se já existe uma conversa DIRECT entre os dois usuários,
   * reaproveita - nunca duplica. Isso implementa a regra "cria automaticamente
   * no primeiro contato".
   */
  async execute(params: { initiatorId: string; recipientId: string }): Promise<Conversation> {
    const existing = await this.conversationRepository.findDirectBetween(
      params.initiatorId,
      params.recipientId,
    );
    if (existing) {
      return existing;
    }

    const conversation = Conversation.createDirect(params, uuid());
    await this.conversationRepository.save(conversation);

    await publishToUsers(this.messageBus, [params.recipientId], 'conversation:created', {
      conversationId: conversation.id,
    });

    return conversation;
  }
}
