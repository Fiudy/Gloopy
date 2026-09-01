import { GameSessionRepository } from '../../domain/repositories/game-session.repository';
import { GameSession } from '../../domain/entities/game-session.entity';
export declare class GetGameSessionUseCase {
    private readonly gameSessionRepository;
    constructor(gameSessionRepository: GameSessionRepository);
    execute(params: {
        sessionId: string;
        requesterId: string;
    }): Promise<GameSession>;
}
