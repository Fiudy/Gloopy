import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { GameSessionRepository } from '../../domain/repositories/game-session.repository';
import { GameSession } from '../../domain/entities/game-session.entity';
export declare class PrismaGameSessionRepository implements GameSessionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<GameSession | null>;
    save(session: GameSession, expectedUpdatedAt?: Date): Promise<void>;
    private toDomain;
}
