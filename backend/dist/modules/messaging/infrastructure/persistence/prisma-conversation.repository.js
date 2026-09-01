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
exports.PrismaConversationRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/infrastructure/prisma/prisma.service");
const conversation_entity_1 = require("../../domain/entities/conversation.entity");
const participant_1 = require("../../domain/entities/participant");
const include = { participants: true };
let PrismaConversationRepository = class PrismaConversationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const record = await this.prisma.conversation.findUnique({ where: { id }, include });
        return record ? this.toDomain(record) : null;
    }
    async findDirectBetween(userAId, userBId) {
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
    async findAllForUser(userId) {
        const records = await this.prisma.conversation.findMany({
            where: {
                participants: { some: { userId, leftAt: null } },
            },
            include,
            orderBy: { updatedAt: 'desc' },
        });
        return records.map((r) => this.toDomain(r));
    }
    async save(conversation) {
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
    toDomain(record) {
        const participants = record.participants.map((p) => new participant_1.Participant(p.userId, p.role, p.joinedAt, p.leftAt, p.removedByUserId));
        const props = {
            type: record.type,
            name: record.name,
            avatarUrl: record.avatarUrl,
            initiatorId: record.initiatorId,
            acceptedAt: record.acceptedAt,
            participants,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        };
        return conversation_entity_1.Conversation.restore(props, record.id);
    }
};
exports.PrismaConversationRepository = PrismaConversationRepository;
exports.PrismaConversationRepository = PrismaConversationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaConversationRepository);
//# sourceMappingURL=prisma-conversation.repository.js.map