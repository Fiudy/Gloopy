import { InviteToGameDto } from '../application/dto/invite-to-game.dto';
import { RespondToInviteDto } from '../application/dto/respond-to-invite.dto';
import { MakeMoveDto } from '../application/dto/make-move.dto';
import { InviteToGameUseCase } from '../application/use-cases/invite-to-game.use-case';
import { RespondToInviteUseCase } from '../application/use-cases/respond-to-invite.use-case';
import { MakeMoveUseCase } from '../application/use-cases/make-move.use-case';
import { GetGameSessionUseCase } from '../application/use-cases/get-game-session.use-case';
export declare class GamesController {
    private readonly inviteToGame;
    private readonly respondToInvite;
    private readonly makeMove;
    private readonly getGameSession;
    constructor(inviteToGame: InviteToGameUseCase, respondToInvite: RespondToInviteUseCase, makeMove: MakeMoveUseCase, getGameSession: GetGameSessionUseCase);
    invite(userId: string, conversationId: string, dto: InviteToGameDto): Promise<import("./mappers/game-session.mapper").GameSessionResponse>;
    get(userId: string, sessionId: string): Promise<import("./mappers/game-session.mapper").GameSessionResponse>;
    respond(userId: string, sessionId: string, dto: RespondToInviteDto): Promise<import("./mappers/game-session.mapper").GameSessionResponse>;
    move(userId: string, sessionId: string, dto: MakeMoveDto): Promise<import("./mappers/game-session.mapper").GameSessionResponse>;
}
