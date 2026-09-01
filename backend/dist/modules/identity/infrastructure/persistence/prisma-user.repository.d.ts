import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
export declare class PrismaUserRepository implements UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    existsByEmail(email: string): Promise<boolean>;
    search(query: string, excludeUserId: string, limit: number): Promise<User[]>;
    save(user: User): Promise<void>;
    private toDomain;
}
