"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaMessageRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/infrastructure/prisma/prisma.service");
const message_entity_1 = require("../../domain/entities/message.entity");
let PrismaMessageRepository = class PrismaMessageRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const record = await this.prisma.message.findUnique({
            where: { id },
            include: { deletions: true },
        });
        return record ? this.toDomain(record) : null;
    }
    async findByConversation(conversationId, options) {
        const records = await this.prisma.message.findMany({
            where: {
                conversationId,
                ...(options.before ? { createdAt: { lt: options.before } } : {}),
            },
            include: { deletions: true },
            orderBy: { createdAt: 'asc' },
            take: options.limit,
        });
        return records.map((r) => this.toDomain(r));
    }
    async save(message) {
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
    async markRead(messageId, userId) {
        await this.prisma.messageRead.upsert({
            where: { messageId_userId: { messageId, userId } },
            create: { messageId, userId },
            update: {},
        });
    }
    toDomain(record) {
        const props = {
            conversationId: record.conversationId,
            senderId: record.senderId,
            type: record.type,
            systemEvent: record.systemEvent,
            content: record.content,
            mediaAssetId: record.mediaAssetId,
            gameSessionId: record.gameSessionId,
            editedAt: record.editedAt,
            deletedForEveryoneAt: record.deletedForEveryoneAt,
            deletedForUserIds: new Set(record.deletions.map((d) => d.userId)),
            createdAt: record.createdAt,
        };
        return message_entity_1.Message.restore(props, record.id);
    }
};
exports.PrismaMessageRepository = PrismaMessageRepository;
exports.PrismaMessageRepository = PrismaMessageRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaMessageRepository);
//# sourceMappingURL=prisma-message.repository.js.map