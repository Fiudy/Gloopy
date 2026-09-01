import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { MessageRepository, FindMessagesOptions } from '../../domain/repositories/message.repository';
import { Message, MessageProps } from '../../domain/entities/message.entity';
import { Message as PrismaMessage, MessageDeletion } from '@prisma/client';

type MessageWithDeletions = PrismaMessage & { deletions: MessageDeletion[] };

@Injectable()
export class PrismaMessageRepository implements MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Message | null> {
    const record = await this.prisma.message.findUnique({
      where: { id },
      include: { deletions: true },
    });
    return record ? this.toDomain(record) : null;
  }

  async findByConversation(conversationId: string, options: FindMessagesOptions): Promise<Message[]> {
    const records = await this.prisma.message.findMany({
      where: {
        conversationId,
        ...(options.before ? { createdAt: { lt: options.before } } : {}),
      },
      include: { deletions: true },
      orderBy: { createdAt: 'desc' },
      take: options.limit,
    });
    return records.map((r) => this.toDomain(r));
  }

  async save(message: Message): Promise<void> {
    const data = message.toPersistence();

    await this.prisma.$transaction(async (tx) => {
      await tx.message.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          conversationId: data.conversationId,
          senderId: data.senderId,
          type: data.type,
          systemEvent: data.systemEvent ?? null,
          content: data.content,
          mediaAssetId: data.mediaAssetId ?? null,
          gameSessionId: data.gameSessionId ?? null,
          editedAt: data.editedAt ?? null,
          deletedForEveryoneAt: data.deletedForEveryoneAt ?? null,
          createdAt: data.createdAt,
        },
        update: {
          content: data.content,
          editedAt: data.editedAt ?? null,
          deletedForEveryoneAt: data.deletedForEveryoneAt ?? null,
        },
      });

      for (const userId of data.deletedForUserIds) {
        await tx.messageDeletion.upsert({
          where: { messageId_userId: { messageId: data.id, userId } },
          create: { messageId: data.id, userId },
          update: {},
        });
      }
    });
  }

  async markRead(messageId: string, userId: string): Promise<void> {
    await this.prisma.messageRead.upsert({
      where: { messageId_userId: { messageId, userId } },
      create: { messageId, userId },
      update: {},
    });
  }

  private toDomain(record: MessageWithDeletions): Message {
    const props: MessageProps = {
      conversationId: record.conversationId,
      senderId: record.senderId,
      type: record.type,
      systemEvent: record.systemEvent as MessageProps['systemEvent'],
      content: record.content,
      mediaAssetId: record.mediaAssetId,
      gameSessionId: record.gameSessionId,
      editedAt: record.editedAt,
      deletedForEveryoneAt: record.deletedForEveryoneAt,
      deletedForUserIds: new Set(record.deletions.map((d) => d.userId)),
      createdAt: record.createdAt,
    };
    return Message.restore(props, record.id);
  }
}
