import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { User as PrismaUser } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    return record ? this.toDomain(record) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } });
    return count > 0;
  }

  async search(query: string, excludeUserId: string, limit: number): Promise<User[]> {
    const records = await this.prisma.user.findMany({
      where: {
        id: { not: excludeUserId },
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'asc' },
      take: limit,
    });
    return records.map((record) => this.toDomain(record));
  }

  async save(user: User): Promise<void> {
    const data = user.toPersistence();
    await this.prisma.user.upsert({
      where: { id: data.id },
      create: {
        id: data.id,
        name: data.name,
        email: data.email.toString(),
        passwordHash: data.passwordHash,
        avatarUrl: data.avatarUrl ?? null,
        showLastSeen: data.showLastSeen,
        readReceiptsEnabled: data.readReceiptsEnabled,
        lastSeenAt: data.lastSeenAt ?? null,
      },
      update: {
        name: data.name,
        avatarUrl: data.avatarUrl ?? null,
        showLastSeen: data.showLastSeen,
        readReceiptsEnabled: data.readReceiptsEnabled,
        lastSeenAt: data.lastSeenAt ?? null,
      },
    });
  }

  private toDomain(record: PrismaUser): User {
    return User.restore(
      {
        name: record.name,
        email: Email.create(record.email),
        passwordHash: record.passwordHash,
        avatarUrl: record.avatarUrl,
        showLastSeen: record.showLastSeen,
        readReceiptsEnabled: record.readReceiptsEnabled,
        lastSeenAt: record.lastSeenAt,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      record.id,
    );
  }
}
