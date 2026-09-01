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
exports.RespondToInviteUseCase = void 0;
const common_1 = require("@nestjs/common");
const message_bus_port_1 = require("../../../../shared/application/message-bus.port");
const publish_to_users_helper_1 = require("../../../../shared/application/publish-to-users.helper");
const game_session_repository_1 = require("../../domain/repositories/game-session.repository");
let RespondToInviteUseCase = class RespondToInviteUseCase {
    constructor(gameSessionRepository, messageBus) {
        this.gameSessionRepository = gameSessionRepository;
        this.messageBus = messageBus;
    }
    async execute(params) {
        const session = await this.load(params.sessionId);
        const expectedUpdatedAt = session.updatedAt;
        if (params.response === 'ACCEPT') {
            session.accept(params.userId);
        }
        else {
            session.decline(params.userId);
        }
        await this.gameSessionRepository.save(session, expectedUpdatedAt);
        await this.notify(session);
        return session;
    }
    async load(sessionId) {
        const session = await this.gameSessionRepository.findById(sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Partida não encontrada.');
        }
        return session;
    }
    async notify(session) {
        await (0, publish_to_users_helper_1.publishToUsers)(this.messageBus, [session.playerXId, session.playerOId], 'game:updated', {
            sessionId: session.id,
            status: session.status,
            board: session.board,
            currentTurnUserId: session.currentTurnUserId,
            winnerUserId: session.winnerUserId,
        });
    }
};
exports.RespondToInviteUseCase = RespondToInviteUseCase;
exports.RespondToInviteUseCase = RespondToInviteUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [game_session_repository_1.GameSessionRepository,
        message_bus_port_1.MessageBusPublisher])
], RespondToInviteUseCase);
//# sourceMappingURL=respond-to-invite.use-case.js.map