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
exports.IdentityController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const register_user_dto_1 = require("../application/dto/register-user.dto");
const login_user_dto_1 = require("../application/dto/login-user.dto");
const register_user_use_case_1 = require("../application/use-cases/register-user.use-case");
const login_user_use_case_1 = require("../application/use-cases/login-user.use-case");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const get_profile_use_case_1 = require("../application/use-cases/get-profile.use-case");
const update_profile_use_case_1 = require("../application/use-cases/update-profile.use-case");
const search_users_use_case_1 = require("../application/use-cases/search-users.use-case");
const update_profile_dto_1 = require("../application/dto/update-profile.dto");
const search_users_dto_1 = require("../application/dto/search-users.dto");
const throttler_1 = require("@nestjs/throttler");
let IdentityController = class IdentityController {
    constructor(registerUserUseCase, loginUserUseCase, getProfile, updateProfile, searchUsers) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
        this.getProfile = getProfile;
        this.updateProfile = updateProfile;
        this.searchUsers = searchUsers;
    }
    async register(dto) {
        return this.registerUserUseCase.execute(dto);
    }
    async login(dto) {
        return this.loginUserUseCase.execute(dto);
    }
    async me(userId) {
        return this.getProfile.execute(userId);
    }
    async updateMe(userId, dto) {
        return this.updateProfile.execute(userId, dto);
    }
    async findUsers(userId, query) {
        return this.searchUsers.execute(userId, query.q, query.limit);
    }
};
exports.IdentityController = IdentityController;
__decorate([
    (0, common_1.Post)('register'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60_000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], IdentityController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60_000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], IdentityController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IdentityController.prototype, "me", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], IdentityController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)('users/search'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, search_users_dto_1.SearchUsersDto]),
    __metadata("design:returntype", Promise)
], IdentityController.prototype, "findUsers", null);
exports.IdentityController = IdentityController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [register_user_use_case_1.RegisterUserUseCase,
        login_user_use_case_1.LoginUserUseCase,
        get_profile_use_case_1.GetProfileUseCase,
        update_profile_use_case_1.UpdateProfileUseCase,
        search_users_use_case_1.SearchUsersUseCase])
], IdentityController);
//# sourceMappingURL=identity.controller.js.map