import { GameSession } from '../../domain/entities/game-session.entity';
export interface GameSessionResponse {
    id: string;
    conversationId: string;
    status: string;
    playerXId: string;
    playerOId: string;
    currentTurnUserId: string | null;
    winnerUserId: string | null;
    board: string;
}
export declare function toGameSessionResponse(session: GameSession): GameSessionResponse;
