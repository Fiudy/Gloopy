import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GameSessionRepository } from '../../domain/repositories/game-session.repository';
import { GameSession } from '../../domain/entities/game-session.entity';

@Injectable()
export class GetGameSessionUseCase {
  constructor(private readonly gameSessionRepository: GameSessionRepository) {}

  async execute(params: { sessionId: string; requesterId: string }): Promise<GameSession> {
    const session = await this.gameSessionRepository.findById(params.sessionId);
    if (!session) {
      throw new NotFoundException('Partida não encontrada.');
    }
    if (!session.isPlayer(params.requesterId)) {
      throw new ForbiddenException('Você não faz parte desta partida.');
    }
    return session;
  }
}
