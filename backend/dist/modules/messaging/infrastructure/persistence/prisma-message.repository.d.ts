import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { MessageRepository, FindMessagesOptions } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';
export declare class PrismaMessageRepository implements MessageRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<Message | null>;
    findByConversation(conversationId: string, options: FindMessagesOptions): Promise<Message[]>;
    save(message: Message): Promise<void>;
    markRead(messageId: string, userId: string): Promise<void>;
    private toDomain;
}
