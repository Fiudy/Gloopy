import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { publishToUsers } from '@shared/application/publish-to-users.helper';
import { GameSessionRepository } from '../../domain/repositories/game-session.repository';
import { GameSession } from '../../domain/entities/game-session.entity';

@Injectable()
export class MakeMoveUseCase {
  constructor(
    private readonly gameSessionRepository: GameSessionRepository,
    private readonly messageBus: MessageBusPublisher,
  ) {}

  async execute(params: { sessionId: string; userId: string; cellIndex: number }): Promise<GameSession> {
    const session = await this.gameSessionRepository.findById(params.sessionId);
    if (!session) {
      throw new NotFoundException('Partida não encontrada.');
    }

    const expectedUpdatedAt = session.updatedAt;
    session.move(params.userId, params.cellIndex); // lança DomainError se jogada inválida
    await this.gameSessionRepository.save(session, expectedUpdatedAt);

    await publishToUsers(this.messageBus, [session.playerXId, session.playerOId], 'game:updated', {
      sessionId: session.id,
      status: session.status,
      board: session.board,
      currentTurnUserId: session.currentTurnUserId,
      winnerUserId: session.winnerUserId,
    });

    return session;
  }
}
