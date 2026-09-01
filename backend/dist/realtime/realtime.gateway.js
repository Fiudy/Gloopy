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
var RealtimeGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const socket_io_1 = require("socket.io");
const rabbitmq_service_1 = require("../shared/infrastructure/rabbitmq/rabbitmq.service");
const presence_service_1 = require("../modules/presence/application/presence.service");
const conversation_repository_1 = require("../modules/messaging/domain/repositories/conversation.repository");
const ws_jwt_auth_guard_1 = require("../common/guards/ws-jwt-auth.guard");
const conversationRoom = (conversationId) => `conversation:${conversationId}`;
const userRoutingKey = (userId) => `user.${userId}`;
let RealtimeGateway = RealtimeGateway_1 = class RealtimeGateway {
    constructor(jwtService, presenceService, conversationRepository, rabbitMq) {
        this.jwtService = jwtService;
        this.presenceService = presenceService;
        this.conversationRepository = conversationRepository;
        this.rabbitMq = rabbitMq;
        this.logger = new common_1.Logger(RealtimeGateway_1.name);
    }
    async handleConnection(client) {
        const userId = await this.authenticate(client);
        if (!userId) {
            client.disconnect(true);
            return;
        }
        const data = client.data;
        data.userId = userId;
        data.joinedConversationIds = new Set();
        const { wasOffline } = await this.presenceService.connect(userId, client.id);
        if (wasOffline) {
            await this.broadcastPresence(userId, 'ONLINE');
        }
        await this.subscribeToUserEvents(client, userId);
    }
    async handleDisconnect(client) {
        const data = client.data;
        if (!data.userId)
            return;
        await this.unsubscribeFromUserEvents(client);
        const { isNowOffline } = await this.presenceService.disconnect(data.userId, client.id);
        if (isNowOffline) {
            await this.broadcastPresence(data.userId, 'OFFLINE');
        }
    }
    async onJoinConversation(client, payload) {
        const userId = client.data.userId;
        const conversation = await this.conversationRepository.findById(payload.conversationId);
        if (!conversation || !conversation.isActiveMember(userId)) {
            return;
        }
        await client.join(conversationRoom(payload.conversationId));
        client.data.joinedConversationIds?.add(payload.conversationId);
    }
    async onLeaveConversationRoom(client, payload) {
        await client.leave(conversationRoom(payload.conversationId));
        client.data.joinedConversationIds?.delete(payload.conversationId);
    }
    onTypingStart(client, payload) {
        const data = client.data;
        if (!data.joinedConversationIds?.has(payload.conversationId))
            return;
        const userId = data.userId;
        client.to(conversationRoom(payload.conversationId)).emit('typing:update', {
            conversationId: payload.conversationId,
            userId,
            isTyping: true,
        });
    }
    onTypingStop(client, payload) {
        const data = client.data;
        if (!data.joinedConversationIds?.has(payload.conversationId))
            return;
        const userId = data.userId;
        client.to(conversationRoom(payload.conversationId)).emit('typing:update', {
            conversationId: payload.conversationId,
            userId,
            isTyping: false,
        });
    }
    async subscribeToUserEvents(client, userId) {
        const channel = await this.rabbitMq.getChannel();
        const queueName = `rt.${client.id}`;
        await channel.assertQueue(queueName, { durable: false, autoDelete: true, exclusive: false });
        await channel.bindQueue(queueName, rabbitmq_service_1.EVENTS_EXCHANGE, userRoutingKey(userId));
        const { consumerTag } = await channel.consume(queueName, (msg) => {
            if (!msg)
                return;
            try {
                const event = JSON.parse(msg.content.toString());
                client.emit(event.type, event.data);
            }
            catch (error) {
                this.logger.warn(`Falha ao processar evento do barramento: ${error.message}`);
            }
            finally {
                channel.ack(msg);
            }
        }, { noAck: false });
        const data = client.data;
        data.consumerTag = consumerTag;
        data.queueName = queueName;
    }
    async unsubscribeFromUserEvents(client) {
        const data = client.data;
        if (!data.consumerTag)
            return;
        try {
            const channel = await this.rabbitMq.getChannel();
            await channel.cancel(data.consumerTag);
        }
        catch (error) {
            this.logger.warn(`Falha ao cancelar consumidor do RabbitMQ: ${error.message}`);
        }
    }
    async broadcastPresence(userId, status) {
        const conversations = await this.conversationRepository.findAllForUser(userId);
        const partnerIds = new Set();
        conversations.forEach((c) => c.activeParticipants.forEach((p) => {
            if (p.userId !== userId)
                partnerIds.add(p.userId);
        }));
        const channel = await this.rabbitMq.getChannel();
        const payload = Buffer.from(JSON.stringify({ type: 'presence:update', data: { userId, status } }));
        partnerIds.forEach((partnerId) => {
            channel.publish(rabbitmq_service_1.EVENTS_EXCHANGE, userRoutingKey(partnerId), payload, { persistent: false });
        });
    }
    async authenticate(client) {
        const raw = client.handshake.auth?.token || client.handshake.headers?.authorization;
        if (!raw)
            return null;
        const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw;
        try {
            const payload = await this.jwtService.verifyAsync(token);
            return payload.sub;
        }
        catch (error) {
            this.logger.warn(`Falha ao autenticar conexão WebSocket: ${error.message}`);
            return null;
        }
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('conversation:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "onJoinConversation", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('conversation:leave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "onLeaveConversationRoom", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('typing:start'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "onTypingStart", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('typing:stop'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "onTypingStop", null);
exports.RealtimeGateway = RealtimeGateway = RealtimeGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN ?? false : true } }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        presence_service_1.PresenceService,
        conversation_repository_1.ConversationRepository,
        rabbitmq_service_1.RabbitMqService])
], RealtimeGateway);
//# sourceMappingURL=realtime.gateway.js.map