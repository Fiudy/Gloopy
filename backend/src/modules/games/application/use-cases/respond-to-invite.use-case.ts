import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { publishToUsers } from '@shared/application/publish-to-users.helper';
import { GameSessionRepository } from '../../domain/repositories/game-session.repository';
import { GameSession } from '../../domain/entities/game-session.entity';

export type InviteResponse = 'ACCEPT' | 'DECLINE';

@Injectable()
export class RespondToInviteUseCase {
  constructor(
    private readonly gameSessionRepository: GameSessionRepository,
    private readonly messageBus: MessageBusPublisher,
  ) {}

  async execute(params: { sessionId: string; userId: string; response: InviteResponse }): Promise<GameSession> {
    const session = await this.load(params.sessionId);
    const expectedUpdatedAt = session.updatedAt;

    if (params.response === 'ACCEPT') {
      session.accept(params.userId); // lança DomainError se regra violada
    } else {
      session.decline(params.userId);
    }

    await this.gameSessionRepository.save(session, expectedUpdatedAt);
    await this.notify(session);

    return session;
  }

  private async load(sessionId: string): Promise<GameSession> {
    const session = await this.gameSessionRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundException('Partida não encontrada.');
    }
    return session;
  }

  private async notify(session: GameSession): Promise<void> {
    await publishToUsers(this.messageBus, [session.playerXId, session.playerOId], 'game:updated', {
      sessionId: session.id,
      status: session.status,
      board: session.board,
      currentTurnUserId: session.currentTurnUserId,
      winnerUserId: session.winnerUserId,
    });
  }
}
