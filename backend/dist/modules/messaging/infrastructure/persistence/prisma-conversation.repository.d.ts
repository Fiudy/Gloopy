import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { Conversation } from '../../domain/entities/conversation.entity';
export declare class PrismaConversationRepository implements ConversationRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<Conversation | null>;
    findDirectBetween(userAId: string, userBId: string): Promise<Conversation | null>;
    findAllForUser(userId: string): Promise<Conversation[]>;
    save(conversation: Conversation): Promise<void>;
    private toDomain;
}
