import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { publishToUsers } from '@shared/application/publish-to-users.helper';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';
import { loadConversationForSending } from '../services/conversation-delivery.helper';

@Injectable()
export class SendMessageUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly messageBus: MessageBusPublisher,
  ) {}

  async execute(params: { conversationId: string; senderId: string; content: string }): Promise<Message> {
    const conversation = await loadConversationForSending(this.conversationRepository, params);

    const message = Message.createText(
      { conversationId: conversation.id, senderId: params.senderId, content: params.content },
      uuid(),
    );
    await this.messageRepository.save(message);

    const recipientUserIds = conversation.activeParticipants
      .map((p) => p.userId)
      .filter((id) => id !== params.senderId);

    await publishToUsers(this.messageBus, recipientUserIds, 'message:created', {
      conversationId: conversation.id,
      messageId: message.id,
    });

    return message;
  }
}
