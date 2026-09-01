"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeModule = void 0;
const common_1 = require("@nestjs/common");
const identity_module_1 = require("../modules/identity/identity.module");
const messaging_module_1 = require("../modules/messaging/messaging.module");
const presence_module_1 = require("../modules/presence/presence.module");
const realtime_gateway_1 = require("./realtime.gateway");
let RealtimeModule = class RealtimeModule {
};
exports.RealtimeModule = RealtimeModule;
exports.RealtimeModule = RealtimeModule = __decorate([
    (0, common_1.Module)({
        imports: [identity_module_1.IdentityModule, messaging_module_1.MessagingModule, presence_module_1.PresenceModule],
        providers: [realtime_gateway_1.RealtimeGateway],
    })
], RealtimeModule);
//# sourceMappingURL=realtime.module.js.map