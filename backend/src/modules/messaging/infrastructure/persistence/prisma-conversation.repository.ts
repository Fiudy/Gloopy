import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { Conversation, ConversationProps } from '../../domain/entities/conversation.entity';
import { Participant, ParticipantRole } from '../../domain/entities/participant';
import { Prisma, Conversation as PrismaConversation, ConversationParticipant as PrismaParticipant } from '@prisma/client';

type ConversationWithParticipants = PrismaConversation & { participants: PrismaParticipant[] };

const include = { participants: true } satisfies Prisma.ConversationInclude;

@Injectable()
export class PrismaConversationRepository implements ConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Conversation | null> {
    const record = await this.prisma.conversation.findUnique({ where: { id }, include });
    return record ? this.toDomain(record) : null;
  }

  async findDirectBetween(userAId: string, userBId: string): Promise<Conversation | null> {
    const record = await this.prisma.conversation.findFirst({
      where: {
        type: 'DIRECT',
        participants: {
          some: { userId: userAId },
        },
        AND: {
          participants: {
            some: { userId: userBId },
          },
        },
      },
      include,
    });
    return record ? this.toDomain(record) : null;
  }

  async findAllForUser(userId: string): Promise<Conversation[]> {
    const records = await this.prisma.conversation.findMany({
      where: {
        participants: { some: { userId, leftAt: null } },
      },
      include,
      orderBy: { updatedAt: 'desc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  async save(conversation: Conversation): Promise<void> {
    const data = conversation.toPersistence();

    await this.prisma.$transaction(async (tx) => {
      await tx.conversation.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          type: data.type,
          name: data.name,
          avatarUrl: data.avatarUrl,
          initiatorId: data.initiatorId,
          acceptedAt: data.acceptedAt,
        },
        update: {
          name: data.name,
          avatarUrl: data.avatarUrl,
          acceptedAt: data.acceptedAt,
          updatedAt: new Date(),
        },
      });

      for (const participant of data.participants) {
        await tx.conversationParticipant.upsert({
          where: {
            conversationId_userId: { conversationId: data.id, userId: participant.userId },
          },
          create: {
            conversationId: data.id,
            userId: participant.userId,
            role: participant.role,
            joinedAt: participant.joinedAt,
            leftAt: participant.leftAt,
            removedByUserId: participant.removedByUserId,
          },
          update: {
            role: participant.role,
            leftAt: participant.leftAt,
            removedByUserId: participant.removedByUserId,
          },
        });
      }
    });
  }

  private toDomain(record: ConversationWithParticipants): Conversation {
    const participants = record.participants.map(
      (p) => new Participant(p.userId, p.role as ParticipantRole, p.joinedAt, p.leftAt, p.removedByUserId),
    );

    const props: ConversationProps = {
      type: record.type,
      name: record.name,
      avatarUrl: record.avatarUrl,
      initiatorId: record.initiatorId,
      acceptedAt: record.acceptedAt,
      participants,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };

    return Conversation.restore(props, record.id);
  }
}
