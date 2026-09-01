"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceModule = void 0;
const common_1 = require("@nestjs/common");
const identity_module_1 = require("../identity/identity.module");
const presence_service_1 = require("./application/presence.service");
const presence_repository_1 = require("./domain/repositories/presence.repository");
const redis_presence_repository_1 = require("./infrastructure/redis-presence.repository");
const redis_provider_1 = require("./infrastructure/redis.provider");
let PresenceModule = class PresenceModule {
};
exports.PresenceModule = PresenceModule;
exports.PresenceModule = PresenceModule = __decorate([
    (0, common_1.Module)({
        imports: [identity_module_1.IdentityModule],
        providers: [
            redis_provider_1.redisProvider,
            presence_service_1.PresenceService,
            { provide: presence_repository_1.PresenceRepository, useClass: redis_presence_repository_1.RedisPresenceRepository },
        ],
        exports: [presence_service_1.PresenceService],
    })
], PresenceModule);
//# sourceMappingURL=presence.module.js.map