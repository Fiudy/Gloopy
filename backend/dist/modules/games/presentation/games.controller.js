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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const invite_to_game_dto_1 = require("../application/dto/invite-to-game.dto");
const respond_to_invite_dto_1 = require("../application/dto/respond-to-invite.dto");
const make_move_dto_1 = require("../application/dto/make-move.dto");
const invite_to_game_use_case_1 = require("../application/use-cases/invite-to-game.use-case");
const respond_to_invite_use_case_1 = require("../application/use-cases/respond-to-invite.use-case");
const make_move_use_case_1 = require("../application/use-cases/make-move.use-case");
const get_game_session_use_case_1 = require("../application/use-cases/get-game-session.use-case");
const game_session_mapper_1 = require("./mappers/game-session.mapper");
let GamesController = class GamesController {
    constructor(inviteToGame, respondToInvite, makeMove, getGameSession) {
        this.inviteToGame = inviteToGame;
        this.respondToInvite = respondToInvite;
        this.makeMove = makeMove;
        this.getGameSession = getGameSession;
    }
    async invite(userId, conversationId, dto) {
        const session = await this.inviteToGame.execute({
            conversationId,
            inviterId: userId,
            opponentId: dto.opponentId,
        });
        return (0, game_session_mapper_1.toGameSessionResponse)(session);
    }
    async get(userId, sessionId) {
        const session = await this.getGameSession.execute({ sessionId, requesterId: userId });
        return (0, game_session_mapper_1.toGameSessionResponse)(session);
    }
    async respond(userId, sessionId, dto) {
        const session = await this.respondToInvite.execute({ sessionId, userId, response: dto.response });
        return (0, game_session_mapper_1.toGameSessionResponse)(session);
    }
    async move(userId, sessionId, dto) {
        const session = await this.makeMove.execute({ sessionId, userId, cellIndex: dto.cellIndex });
        return (0, game_session_mapper_1.toGameSessionResponse)(session);
    }
};
exports.GamesController = GamesController;
__decorate([
    (0, common_1.Post)('conversations/:id/game-invites'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, invite_to_game_dto_1.InviteToGameDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "invite", null);
__decorate([
    (0, common_1.Get)('games/:sessionId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "get", null);
__decorate([
    (0, common_1.Post)('games/:sessionId/respond'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, respond_to_invite_dto_1.RespondToInviteDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "respond", null);
__decorate([
    (0, common_1.Post)('games/:sessionId/moves'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, make_move_dto_1.MakeMoveDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "move", null);
exports.GamesController = GamesController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [invite_to_game_use_case_1.InviteToGameUseCase,
        respond_to_invite_use_case_1.RespondToInviteUseCase,
        make_move_use_case_1.MakeMoveUseCase,
        get_game_session_use_case_1.GetGameSessionUseCase])
], GamesController);
//# sourceMappingURL=games.controller.js.map