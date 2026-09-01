import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { DomainError } from '@shared/domain/domain-error';
import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { publishToUsers } from '@shared/application/publish-to-users.helper';
import { ConversationRepository } from '@modules/messaging/domain/repositories/conversation.repository';
import { MessageRepository } from '@modules/messaging/domain/repositories/message.repository';
import { Message } from '@modules/messaging/domain/entities/message.entity';
import { loadConversationForSending } from '@modules/messaging/application/services/conversation-delivery.helper';
import { GameSessionRepository } from '../../domain/repositories/game-session.repository';
import { GameSession } from '../../domain/entities/game-session.entity';

@Injectable()
export class InviteToGameUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly gameSessionRepository: GameSessionRepository,
    private readonly messageBus: MessageBusPublisher,
  ) {}

  async execute(params: { conversationId: string; inviterId: string; opponentId: string }): Promise<GameSession> {
    const conversation = await loadConversationForSending(this.conversationRepository, {
      conversationId: params.conversationId,
      senderId: params.inviterId,
    });

    // O oponente também precisa ser um membro ativo da conversa - regra de negócio
    // do domínio de Games (não faz sentido convidar alguém de fora da conversa).
    if (!conversation.isActiveMember(params.opponentId)) {
      throw new DomainError('O oponente precisa fazer parte da conversa.');
    }

    const session = GameSession.invite(
      { conversationId: conversation.id, invitedByUserId: params.inviterId, opponentId: params.opponentId },
      uuid(),
    );
    await this.gameSessionRepository.save(session);

    const inviteMessage = Message.createGameInvite(
      {
        conversationId: conversation.id,
        senderId: params.inviterId,
        gameSessionId: session.id,
        content: 'Convite para jogo da velha 🎮',
      },
      uuid(),
    );
    await this.messageRepository.save(inviteMessage);

    const recipientUserIds = conversation.activeParticipants
      .map((p) => p.userId)
      .filter((id) => id !== params.inviterId);

    await publishToUsers(this.messageBus, recipientUserIds, 'message:created', {
      conversationId: conversation.id,
      messageId: inviteMessage.id,
    });

    return session;
  }
}
