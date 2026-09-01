"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./shared/infrastructure/prisma/prisma.module");
const rabbitmq_module_1 = require("./shared/infrastructure/rabbitmq/rabbitmq.module");
const identity_module_1 = require("./modules/identity/identity.module");
const messaging_module_1 = require("./modules/messaging/messaging.module");
const presence_module_1 = require("./modules/presence/presence.module");
const media_module_1 = require("./modules/media/media.module");
const games_module_1 = require("./modules/games/games.module");
const realtime_module_1 = require("./realtime/realtime.module");
const app_controller_1 = require("./app.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
            prisma_module_1.PrismaModule,
            rabbitmq_module_1.RabbitMqModule,
            identity_module_1.IdentityModule,
            messaging_module_1.MessagingModule,
            presence_module_1.PresenceModule,
            media_module_1.MediaModule,
            games_module_1.GamesModule,
            realtime_module_1.RealtimeModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [{ provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard }],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map