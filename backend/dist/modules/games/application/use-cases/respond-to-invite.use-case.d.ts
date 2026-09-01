import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { GameSessionRepository } from '../../domain/repositories/game-session.repository';
import { GameSession } from '../../domain/entities/game-session.entity';
export type InviteResponse = 'ACCEPT' | 'DECLINE';
export declare class RespondToInviteUseCase {
    private readonly gameSessionRepository;
    private readonly messageBus;
    constructor(gameSessionRepository: GameSessionRepository, messageBus: MessageBusPublisher);
    execute(params: {
        sessionId: string;
        userId: string;
        response: InviteResponse;
    }): Promise<GameSession>;
    private load;
    private notify;
}
