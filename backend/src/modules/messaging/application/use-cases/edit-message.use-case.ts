import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { publishToUsers } from '@shared/application/publish-to-users.helper';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';

@Injectable()
export class EditMessageUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly messageBus: MessageBusPublisher,
  ) {}

  async execute(params: { messageId: string; requesterId: string; content: string }): Promise<Message> {
    const message = await this.messageRepository.findById(params.messageId);
    if (!message) {
      throw new NotFoundException('Mensagem não encontrada.');
    }

    const conversation = await this.conversationRepository.findById(message.conversationId);
    if (!conversation || !conversation.isActiveMember(params.requesterId)) {
      throw new ForbiddenException('Você não faz parte desta conversa.');
    }

    message.edit(params.requesterId, params.content); // lança DomainError se violar regra
    await this.messageRepository.save(message);

    const recipientUserIds = conversation.activeParticipants.map((p) => p.userId);
    await publishToUsers(this.messageBus, recipientUserIds, 'message:updated', {
      conversationId: conversation.id,
      messageId: message.id,
    });

    return message;
  }
}
