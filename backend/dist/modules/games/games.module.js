"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesModule = void 0;
const common_1 = require("@nestjs/common");
const messaging_module_1 = require("../messaging/messaging.module");
const games_controller_1 = require("./presentation/games.controller");
const game_session_repository_1 = require("./domain/repositories/game-session.repository");
const prisma_game_session_repository_1 = require("./infrastructure/persistence/prisma-game-session.repository");
const invite_to_game_use_case_1 = require("./application/use-cases/invite-to-game.use-case");
const respond_to_invite_use_case_1 = require("./application/use-cases/respond-to-invite.use-case");
const make_move_use_case_1 = require("./application/use-cases/make-move.use-case");
const get_game_session_use_case_1 = require("./application/use-cases/get-game-session.use-case");
let GamesModule = class GamesModule {
};
exports.GamesModule = GamesModule;
exports.GamesModule = GamesModule = __decorate([
    (0, common_1.Module)({
        imports: [messaging_module_1.MessagingModule],
        controllers: [games_controller_1.GamesController],
        providers: [
            { provide: game_session_repository_1.GameSessionRepository, useClass: prisma_game_session_repository_1.PrismaGameSessionRepository },
            invite_to_game_use_case_1.InviteToGameUseCase,
            respond_to_invite_use_case_1.RespondToInviteUseCase,
            make_move_use_case_1.MakeMoveUseCase,
            get_game_session_use_case_1.GetGameSessionUseCase,
        ],
    })
], GamesModule);
//# sourceMappingURL=games.module.js.map