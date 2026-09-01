"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const identity_controller_1 = require("./presentation/identity.controller");
const register_user_use_case_1 = require("./application/use-cases/register-user.use-case");
const login_user_use_case_1 = require("./application/use-cases/login-user.use-case");
const user_repository_1 = require("./domain/repositories/user.repository");
const prisma_user_repository_1 = require("./infrastructure/persistence/prisma-user.repository");
const jwt_strategy_1 = require("./infrastructure/security/jwt.strategy");
const get_profile_use_case_1 = require("./application/use-cases/get-profile.use-case");
const update_profile_use_case_1 = require("./application/use-cases/update-profile.use-case");
const search_users_use_case_1 = require("./application/use-cases/search-users.use-case");
let IdentityModule = class IdentityModule {
};
exports.IdentityModule = IdentityModule;
exports.IdentityModule = IdentityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET', 'change-me-in-production'),
                    signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '7d') },
                }),
            }),
        ],
        controllers: [identity_controller_1.IdentityController],
        providers: [
            register_user_use_case_1.RegisterUserUseCase,
            login_user_use_case_1.LoginUserUseCase,
            jwt_strategy_1.JwtStrategy,
            get_profile_use_case_1.GetProfileUseCase,
            update_profile_use_case_1.UpdateProfileUseCase,
            search_users_use_case_1.SearchUsersUseCase,
            { provide: user_repository_1.UserRepository, useClass: prisma_user_repository_1.PrismaUserRepository },
        ],
        exports: [user_repository_1.UserRepository, jwt_1.JwtModule],
    })
], IdentityModule);
//# sourceMappingURL=identity.module.js.map