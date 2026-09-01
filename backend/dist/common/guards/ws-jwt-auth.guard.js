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
exports.WsJwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let WsJwtAuthGuard = class WsJwtAuthGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const client = context.switchToWs().getClient();
        const token = this.extractToken(client);
        if (!token) {
            throw new common_1.UnauthorizedException('Token de autenticação ausente.');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token);
            client.data.userId = payload.sub;
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException('Token de autenticação inválido.');
        }
    }
    extractToken(client) {
        const raw = client.handshake.auth?.token || client.handshake.headers?.authorization;
        if (!raw)
            return null;
        return raw.startsWith('Bearer ') ? raw.slice(7) : raw;
    }
};
exports.WsJwtAuthGuard = WsJwtAuthGuard;
exports.WsJwtAuthGuard = WsJwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], WsJwtAuthGuard);
//# sourceMappingURL=ws-jwt-auth.guard.js.map