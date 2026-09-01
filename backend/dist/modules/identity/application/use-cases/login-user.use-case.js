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
exports.LoginUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_repository_1 = require("../../domain/repositories/user.repository");
let LoginUserUseCase = class LoginUserUseCase {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async execute(input) {
        const user = await this.userRepository.findByEmail(input.email.trim().toLowerCase());
        if (!user) {
            throw new common_1.UnauthorizedException('E-mail ou senha inválidos.');
        }
        const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('E-mail ou senha inválidos.');
        }
        const accessToken = await this.jwtService.signAsync({ sub: user.id });
        return {
            accessToken,
            user: { id: user.id, name: user.name, email: user.email.toString() },
        };
    }
};
exports.LoginUserUseCase = LoginUserUseCase;
exports.LoginUserUseCase = LoginUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        jwt_1.JwtService])
], LoginUserUseCase);
//# sourceMappingURL=login-user.use-case.js.map