import { GameSession } from '../entities/game-session.entity';

export abstract class GameSessionRepository {
  abstract findById(id: string): Promise<GameSession | null>;
  abstract save(session: GameSession, expectedUpdatedAt?: Date): Promise<void>;
}
