import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { GameSessionRepository } from '../../domain/repositories/game-session.repository';
import { GameSession } from '../../domain/entities/game-session.entity';
export declare class MakeMoveUseCase {
    private readonly gameSessionRepository;
    private readonly messageBus;
    constructor(gameSessionRepository: GameSessionRepository, messageBus: MessageBusPublisher);
    execute(params: {
        sessionId: string;
        userId: string;
        cellIndex: number;
    }): Promise<GameSession>;
}
