import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { publishToUsers } from '@shared/application/publish-to-users.helper';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';

export type DeleteScope = 'ME' | 'EVERYONE';

@Injectable()
export class DeleteMessageUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly messageBus: MessageBusPublisher,
  ) {}

  async execute(params: { messageId: string; requesterId: string; scope: DeleteScope }): Promise<void> {
    const message = await this.messageRepository.findById(params.messageId);
    if (!message) {
      throw new NotFoundException('Mensagem não encontrada.');
    }

    const conversation = await this.conversationRepository.findById(message.conversationId);
    if (!conversation || !conversation.isActiveMember(params.requesterId)) {
      throw new ForbiddenException('Você não faz parte desta conversa.');
    }

    let affectedUserIds: string[];

    if (params.scope === 'ME') {
      message.deleteForMe(params.requesterId);
      affectedUserIds = [params.requesterId];
    } else {
      message.deleteForEveryone(params.requesterId); // lança DomainError se não for o autor
      affectedUserIds = conversation.activeParticipants.map((p) => p.userId);
    }

    await this.messageRepository.save(message);

    await publishToUsers(this.messageBus, affectedUserIds, 'message:deleted', {
      conversationId: conversation.id,
      messageId: message.id,
      scope: params.scope,
    });
  }
}
