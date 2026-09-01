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
exports.CreateGroupConversationUseCase = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const message_bus_port_1 = require("../../../../shared/application/message-bus.port");
const publish_to_users_helper_1 = require("../../../../shared/application/publish-to-users.helper");
const conversation_repository_1 = require("../../domain/repositories/conversation.repository");
const message_repository_1 = require("../../domain/repositories/message.repository");
const conversation_entity_1 = require("../../domain/entities/conversation.entity");
const message_entity_1 = require("../../domain/entities/message.entity");
let CreateGroupConversationUseCase = class CreateGroupConversationUseCase {
    constructor(conversationRepository, messageRepository, messageBus) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.messageBus = messageBus;
    }
    async execute(params) {
        const conversation = conversation_entity_1.Conversation.createGroup(params, (0, uuid_1.v4)());
        await this.conversationRepository.save(conversation);
        const systemMessage = message_entity_1.Message.createSystem({
            conversationId: conversation.id,
            event: 'GROUP_CREATED',
            content: `Grupo "${conversation.name}" foi criado.`,
        }, (0, uuid_1.v4)());
        await this.messageRepository.save(systemMessage);
        await (0, publish_to_users_helper_1.publishToUsers)(this.messageBus, params.memberIds, 'conversation:created', {
            conversationId: conversation.id,
        });
        return conversation;
    }
};
exports.CreateGroupConversationUseCase = CreateGroupConversationUseCase;
exports.CreateGroupConversationUseCase = CreateGroupConversationUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [conversation_repository_1.ConversationRepository,
        message_repository_1.MessageRepository,
        message_bus_port_1.MessageBusPublisher])
], CreateGroupConversationUseCase);
//# sourceMappingURL=create-group-conversation.use-case.js.map