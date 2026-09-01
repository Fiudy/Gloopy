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
exports.RegisterUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const user_repository_1 = require("../../domain/repositories/user.repository");
const user_entity_1 = require("../../domain/entities/user.entity");
const email_vo_1 = require("../../domain/value-objects/email.vo");
const SALT_ROUNDS = 12;
let RegisterUserUseCase = class RegisterUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(input) {
        const email = email_vo_1.Email.create(input.email);
        const alreadyExists = await this.userRepository.existsByEmail(email.toString());
        if (alreadyExists) {
            throw new common_1.ConflictException('Já existe uma conta com este e-mail.');
        }
        const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
        const user = user_entity_1.User.create({
            name: input.name,
            email,
            passwordHash,
        }, (0, uuid_1.v4)());
        await this.userRepository.save(user);
        return {
            id: user.id,
            name: user.name,
            email: user.email.toString(),
        };
    }
};
exports.RegisterUserUseCase = RegisterUserUseCase;
exports.RegisterUserUseCase = RegisterUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], RegisterUserUseCase);
//# sourceMappingURL=register-user.use-case.js.map