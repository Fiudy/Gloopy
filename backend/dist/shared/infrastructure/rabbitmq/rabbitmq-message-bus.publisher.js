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
exports.RabbitMqMessageBusPublisher = void 0;
const common_1 = require("@nestjs/common");
const rabbitmq_service_1 = require("./rabbitmq.service");
const userRoutingKey = (userId) => `user.${userId}`;
const conversationRoutingKey = (conversationId) => `conversation.${conversationId}`;
let RabbitMqMessageBusPublisher = class RabbitMqMessageBusPublisher {
    constructor(rabbitMq) {
        this.rabbitMq = rabbitMq;
    }
    async publishToUser(userId, event) {
        await this.publish(userRoutingKey(userId), event);
    }
    async publishToConversation(conversationId, event) {
        await this.publish(conversationRoutingKey(conversationId), event);
    }
    async publish(routingKey, event) {
        const channel = await this.rabbitMq.getChannel();
        channel.publish(rabbitmq_service_1.EVENTS_EXCHANGE, routingKey, Buffer.from(JSON.stringify(event)), {
            persistent: false,
            contentType: 'application/json',
        });
    }
};
exports.RabbitMqMessageBusPublisher = RabbitMqMessageBusPublisher;
exports.RabbitMqMessageBusPublisher = RabbitMqMessageBusPublisher = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rabbitmq_service_1.RabbitMqService])
], RabbitMqMessageBusPublisher);
//# sourceMappingURL=rabbitmq-message-bus.publisher.js.map