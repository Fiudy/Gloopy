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

export function toGameSessionResponse(session: GameSession): GameSessionResponse {
  return {
    id: session.id,
    conversationId: session.conversationId,
    status: session.status,
    playerXId: session.playerXId,
    playerOId: session.playerOId,
    currentTurnUserId: session.currentTurnUserId,
    winnerUserId: session.winnerUserId,
    board: session.board,
  };
}
