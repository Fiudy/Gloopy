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
exports.PrismaGameSessionRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/infrastructure/prisma/prisma.service");
const game_session_entity_1 = require("../../domain/entities/game-session.entity");
const tic_tac_toe_board_vo_1 = require("../../domain/value-objects/tic-tac-toe-board.vo");
let PrismaGameSessionRepository = class PrismaGameSessionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const record = await this.prisma.gameSession.findUnique({ where: { id } });
        return record ? this.toDomain(record) : null;
    }
    async save(session, expectedUpdatedAt) {
        const data = session.toPersistence();
        if (expectedUpdatedAt) {
            const result = await this.prisma.gameSession.updateMany({
                where: { id: data.id, updatedAt: expectedUpdatedAt },
                data: { status: data.status, currentTurnUserId: data.currentTurnUserId, winnerUserId: data.winnerUserId, board: data.board },
            });
            if (result.count !== 1)
                throw new common_1.ConflictException('A partida foi atualizada em outro dispositivo. Recarregue e tente novamente.');
            return;
        }
        await this.prisma.gameSession.upsert({
            where: { id: data.id },
            create: {
                id: data.id,
                conversationId: data.conversationId,
                type: data.type,
                status: data.status,
                invitedByUserId: data.invitedByUserId,
                playerXId: data.playerXId,
                playerOId: data.playerOId,
                currentTurnUserId: data.currentTurnUserId,
                winnerUserId: data.winnerUserId,
                board: data.board,
                createdAt: data.createdAt,
            },
            update: {
                status: data.status,
                currentTurnUserId: data.currentTurnUserId,
                winnerUserId: data.winnerUserId,
                board: data.board,
            },
        });
    }
    toDomain(record) {
        const props = {
            conversationId: record.conversationId,
            type: record.type,
            status: record.status,
            invitedByUserId: record.invitedByUserId,
            playerXId: record.playerXId,
            playerOId: record.playerOId,
            currentTurnUserId: record.currentTurnUserId,
            winnerUserId: record.winnerUserId,
            board: tic_tac_toe_board_vo_1.TicTacToeBoard.fromString(record.board),
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        };
        return game_session_entity_1.GameSession.restore(props, record.id);
    }
};
exports.PrismaGameSessionRepository = PrismaGameSessionRepository;
exports.PrismaGameSessionRepository = PrismaGameSessionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaGameSessionRepository);
//# sourceMappingURL=prisma-game-session.repository.js.map