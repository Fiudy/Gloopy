"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisProvider = exports.REDIS_CLIENT = void 0;
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
exports.REDIS_CLIENT = Symbol('REDIS_CLIENT');
exports.redisProvider = {
    provide: exports.REDIS_CLIENT,
    inject: [config_1.ConfigService],
    useFactory: (config) => {
        return new ioredis_1.default({
            host: config.get('REDIS_HOST', 'localhost'),
            port: config.get('REDIS_PORT', 6379),
        });
    },
};
//# sourceMappingURL=redis.provider.js.map