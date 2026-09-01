import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { publishToUsers } from '@shared/application/publish-to-users.helper';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { Conversation } from '../../domain/entities/conversation.entity';
import { Message } from '../../domain/entities/message.entity';

@Injectable()
export class CreateGroupConversationUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly messageBus: MessageBusPublisher,
  ) {}

  async execute(params: { creatorId: string; name: string; memberIds: string[] }): Promise<Conversation> {
    const conversation = Conversation.createGroup(params, uuid());
    await this.conversationRepository.save(conversation);

    const systemMessage = Message.createSystem(
      {
        conversationId: conversation.id,
        event: 'GROUP_CREATED',
        content: `Grupo "${conversation.name}" foi criado.`,
      },
      uuid(),
    );
    await this.messageRepository.save(systemMessage);

    await publishToUsers(this.messageBus, params.memberIds, 'conversation:created', {
      conversationId: conversation.id,
    });

    return conversation;
  }
}
