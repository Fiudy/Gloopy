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
exports.PrismaUserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/infrastructure/prisma/prisma.service");
const user_entity_1 = require("../../domain/entities/user.entity");
const email_vo_1 = require("../../domain/value-objects/email.vo");
let PrismaUserRepository = class PrismaUserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const record = await this.prisma.user.findUnique({ where: { id } });
        return record ? this.toDomain(record) : null;
    }
    async findByEmail(email) {
        const record = await this.prisma.user.findUnique({ where: { email } });
        return record ? this.toDomain(record) : null;
    }
    async existsByEmail(email) {
        const count = await this.prisma.user.count({ where: { email } });
        return count > 0;
    }
    async search(query, excludeUserId, limit) {
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
    async save(user) {
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
    toDomain(record) {
        return user_entity_1.User.restore({
            name: record.name,
            email: email_vo_1.Email.create(record.email),
            passwordHash: record.passwordHash,
            avatarUrl: record.avatarUrl,
            showLastSeen: record.showLastSeen,
            readReceiptsEnabled: record.readReceiptsEnabled,
            lastSeenAt: record.lastSeenAt,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        }, record.id);
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaUserRepository);
//# sourceMappingURL=prisma-user.repository.js.map