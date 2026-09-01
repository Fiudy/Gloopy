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
exports.GetGameSessionUseCase = void 0;
const common_1 = require("@nestjs/common");
const game_session_repository_1 = require("../../domain/repositories/game-session.repository");
let GetGameSessionUseCase = class GetGameSessionUseCase {
    constructor(gameSessionRepository) {
        this.gameSessionRepository = gameSessionRepository;
    }
    async execute(params) {
        const session = await this.gameSessionRepository.findById(params.sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Partida não encontrada.');
        }
        if (!session.isPlayer(params.requesterId)) {
            throw new common_1.ForbiddenException('Você não faz parte desta partida.');
        }
        return session;
    }
};
exports.GetGameSessionUseCase = GetGameSessionUseCase;
exports.GetGameSessionUseCase = GetGameSessionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [game_session_repository_1.GameSessionRepository])
], GetGameSessionUseCase);
//# sourceMappingURL=get-game-session.use-case.js.map