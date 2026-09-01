import { Module } from '@nestjs/common';
import { MessagingModule } from '@modules/messaging/messaging.module';
import { GamesController } from './presentation/games.controller';
import { GameSessionRepository } from './domain/repositories/game-session.repository';
import { PrismaGameSessionRepository } from './infrastructure/persistence/prisma-game-session.repository';
import { InviteToGameUseCase } from './application/use-cases/invite-to-game.use-case';
import { RespondToInviteUseCase } from './application/use-cases/respond-to-invite.use-case';
import { MakeMoveUseCase } from './application/use-cases/make-move.use-case';
import { GetGameSessionUseCase } from './application/use-cases/get-game-session.use-case';

@Module({
  imports: [MessagingModule], // reaproveita ConversationRepository/MessageRepository pra criar o convite como mensagem
  controllers: [GamesController],
  providers: [
    { provide: GameSessionRepository, useClass: PrismaGameSessionRepository },
    InviteToGameUseCase,
    RespondToInviteUseCase,
    MakeMoveUseCase,
    GetGameSessionUseCase,
  ],
})
export class GamesModule {}
