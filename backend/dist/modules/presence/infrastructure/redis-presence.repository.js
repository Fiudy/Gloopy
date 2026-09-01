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
exports.RedisPresenceRepository = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const redis_provider_1 = require("./redis.provider");
const key = (userId) => `presence:connections:${userId}`;
let RedisPresenceRepository = class RedisPresenceRepository {
    constructor(redis) {
        this.redis = redis;
    }
    async addConnection(userId, socketId) {
        const countBefore = await this.redis.scard(key(userId));
        await this.redis.sadd(key(userId), socketId);
        return { wasOffline: countBefore === 0 };
    }
    async removeConnection(userId, socketId) {
        await this.redis.srem(key(userId), socketId);
        const countAfter = await this.redis.scard(key(userId));
        return { isNowOffline: countAfter === 0 };
    }
    async isOnline(userId) {
        const count = await this.redis.scard(key(userId));
        return count > 0;
    }
    async filterOnline(userIds) {
        if (userIds.length === 0)
            return [];
        const pipeline = this.redis.pipeline();
        userIds.forEach((id) => pipeline.scard(key(id)));
        const results = await pipeline.exec();
        return userIds.filter((_, index) => Number(results?.[index]?.[1] ?? 0) > 0);
    }
};
exports.RedisPresenceRepository = RedisPresenceRepository;
exports.RedisPresenceRepository = RedisPresenceRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_provider_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [ioredis_1.default])
], RedisPresenceRepository);
//# sourceMappingURL=redis-presence.repository.js.map