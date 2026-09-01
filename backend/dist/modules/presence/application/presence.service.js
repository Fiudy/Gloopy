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
exports.PresenceService = void 0;
const common_1 = require("@nestjs/common");
const presence_repository_1 = require("../domain/repositories/presence.repository");
const user_repository_1 = require("../../identity/domain/repositories/user.repository");
let PresenceService = class PresenceService {
    constructor(presenceRepository, userRepository) {
        this.presenceRepository = presenceRepository;
        this.userRepository = userRepository;
    }
    async connect(userId, socketId) {
        return this.presenceRepository.addConnection(userId, socketId);
    }
    async disconnect(userId, socketId) {
        const result = await this.presenceRepository.removeConnection(userId, socketId);
        if (result.isNowOffline) {
            const user = await this.userRepository.findById(userId);
            if (user) {
                user.touchLastSeen();
                await this.userRepository.save(user);
            }
        }
        return result;
    }
    async isOnline(userId) {
        return this.presenceRepository.isOnline(userId);
    }
    async filterOnline(userIds) {
        return this.presenceRepository.filterOnline(userIds);
    }
};
exports.PresenceService = PresenceService;
exports.PresenceService = PresenceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [presence_repository_1.PresenceRepository,
        user_repository_1.UserRepository])
], PresenceService);
//# sourceMappingURL=presence.service.js.map