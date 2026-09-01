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
exports.CreateDirectConversationUseCase = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const message_bus_port_1 = require("../../../../shared/application/message-bus.port");
const publish_to_users_helper_1 = require("../../../../shared/application/publish-to-users.helper");
const conversation_repository_1 = require("../../domain/repositories/conversation.repository");
const conversation_entity_1 = require("../../domain/entities/conversation.entity");
let CreateDirectConversationUseCase = class CreateDirectConversationUseCase {
    constructor(conversationRepository, messageBus) {
        this.conversationRepository = conversationRepository;
        this.messageBus = messageBus;
    }
    async execute(params) {
        const existing = await this.conversationRepository.findDirectBetween(params.initiatorId, params.recipientId);
        if (existing) {
            return existing;
        }
        const conversation = conversation_entity_1.Conversation.createDirect(params, (0, uuid_1.v4)());
        await this.conversationRepository.save(conversation);
        await (0, publish_to_users_helper_1.publishToUsers)(this.messageBus, [params.recipientId], 'conversation:created', {
            conversationId: conversation.id,
        });
        return conversation;
    }
};
exports.CreateDirectConversationUseCase = CreateDirectConversationUseCase;
exports.CreateDirectConversationUseCase = CreateDirectConversationUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [conversation_repository_1.ConversationRepository,
        message_bus_port_1.MessageBusPublisher])
], CreateDirectConversationUseCase);
//# sourceMappingURL=create-direct-conversation.use-case.js.map