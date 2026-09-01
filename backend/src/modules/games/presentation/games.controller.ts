import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { InviteToGameDto } from '../application/dto/invite-to-game.dto';
import { RespondToInviteDto } from '../application/dto/respond-to-invite.dto';
import { MakeMoveDto } from '../application/dto/make-move.dto';
import { InviteToGameUseCase } from '../application/use-cases/invite-to-game.use-case';
import { RespondToInviteUseCase } from '../application/use-cases/respond-to-invite.use-case';
import { MakeMoveUseCase } from '../application/use-cases/make-move.use-case';
import { GetGameSessionUseCase } from '../application/use-cases/get-game-session.use-case';
import { toGameSessionResponse } from './mappers/game-session.mapper';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class GamesController {
  constructor(
    private readonly inviteToGame: InviteToGameUseCase,
    private readonly respondToInvite: RespondToInviteUseCase,
    private readonly makeMove: MakeMoveUseCase,
    private readonly getGameSession: GetGameSessionUseCase,
  ) {}

  @Post('conversations/:id/game-invites')
  @HttpCode(HttpStatus.CREATED)
  async invite(@CurrentUser() userId: string, @Param('id') conversationId: string, @Body() dto: InviteToGameDto) {
    const session = await this.inviteToGame.execute({
      conversationId,
      inviterId: userId,
      opponentId: dto.opponentId,
    });
    return toGameSessionResponse(session);
  }

  @Get('games/:sessionId')
  async get(@CurrentUser() userId: string, @Param('sessionId') sessionId: string) {
    const session = await this.getGameSession.execute({ sessionId, requesterId: userId });
    return toGameSessionResponse(session);
  }

  @Post('games/:sessionId/respond')
  async respond(
    @CurrentUser() userId: string,
    @Param('sessionId') sessionId: string,
    @Body() dto: RespondToInviteDto,
  ) {
    const session = await this.respondToInvite.execute({ sessionId, userId, response: dto.response });
    return toGameSessionResponse(session);
  }

  @Post('games/:sessionId/moves')
  @HttpCode(HttpStatus.OK)
  async move(@CurrentUser() userId: string, @Param('sessionId') sessionId: string, @Body() dto: MakeMoveDto) {
    const session = await this.makeMove.execute({ sessionId, userId, cellIndex: dto.cellIndex });
    return toGameSessionResponse(session);
  }
}
