import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { GameSessionRepository } from '../../domain/repositories/game-session.repository';
import { GameSession, GameSessionProps } from '../../domain/entities/game-session.entity';
import { TicTacToeBoard } from '../../domain/value-objects/tic-tac-toe-board.vo';
import { GameSession as PrismaGameSession } from '@prisma/client';

@Injectable()
export class PrismaGameSessionRepository implements GameSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<GameSession | null> {
    const record = await this.prisma.gameSession.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async save(session: GameSession, expectedUpdatedAt?: Date): Promise<void> {
    const data = session.toPersistence();
    if (expectedUpdatedAt) {
      const result = await this.prisma.gameSession.updateMany({
        where: { id: data.id, updatedAt: expectedUpdatedAt },
        data: { status: data.status, currentTurnUserId: data.currentTurnUserId, winnerUserId: data.winnerUserId, board: data.board },
      });
      if (result.count !== 1) throw new ConflictException('A partida foi atualizada em outro dispositivo. Recarregue e tente novamente.');
      return;
    }
    await this.prisma.gameSession.upsert({
      where: { id: data.id },
      create: {
        id: data.id,
        conversationId: data.conversationId,
        type: data.type,
        status: data.status,
        invitedByUserId: data.invitedByUserId,
        playerXId: data.playerXId,
        playerOId: data.playerOId,
        currentTurnUserId: data.currentTurnUserId,
        winnerUserId: data.winnerUserId,
        board: data.board,
        createdAt: data.createdAt,
      },
      update: {
        status: data.status,
        currentTurnUserId: data.currentTurnUserId,
        winnerUserId: data.winnerUserId,
        board: data.board,
      },
    });
  }

  private toDomain(record: PrismaGameSession): GameSession {
    const props: GameSessionProps = {
      conversationId: record.conversationId,
      type: record.type,
      status: record.status,
      invitedByUserId: record.invitedByUserId,
      playerXId: record.playerXId,
      playerOId: record.playerOId,
      currentTurnUserId: record.currentTurnUserId,
      winnerUserId: record.winnerUserId,
      board: TicTacToeBoard.fromString(record.board),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
    return GameSession.restore(props, record.id);
  }
}
