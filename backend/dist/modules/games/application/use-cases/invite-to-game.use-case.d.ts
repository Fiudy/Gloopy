import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { ConversationRepository } from '@modules/messaging/domain/repositories/conversation.repository';
import { MessageRepository } from '@modules/messaging/domain/repositories/message.repository';
import { GameSessionRepository } from '../../domain/repositories/game-session.repository';
import { GameSession } from '../../domain/entities/game-session.entity';
export declare class InviteToGameUseCase {
    private readonly conversationRepository;
    private readonly messageRepository;
    private readonly gameSessionRepository;
    private readonly messageBus;
    constructor(conversationRepository: ConversationRepository, messageRepository: MessageRepository, gameSessionRepository: GameSessionRepository, messageBus: MessageBusPublisher);
    execute(params: {
        conversationId: string;
        inviterId: string;
        opponentId: string;
    }): Promise<GameSession>;
}
