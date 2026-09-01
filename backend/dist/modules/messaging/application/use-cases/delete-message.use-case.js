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
exports.DeleteMessageUseCase = void 0;
const common_1 = require("@nestjs/common");
const message_bus_port_1 = require("../../../../shared/application/message-bus.port");
const publish_to_users_helper_1 = require("../../../../shared/application/publish-to-users.helper");
const conversation_repository_1 = require("../../domain/repositories/conversation.repository");
const message_repository_1 = require("../../domain/repositories/message.repository");
let DeleteMessageUseCase = class DeleteMessageUseCase {
    constructor(conversationRepository, messageRepository, messageBus) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.messageBus = messageBus;
    }
    async execute(params) {
        const message = await this.messageRepository.findById(params.messageId);
        if (!message) {
            throw new common_1.NotFoundException('Mensagem não encontrada.');
        }
        const conversation = await this.conversationRepository.findById(message.conversationId);
        if (!conversation || !conversation.isActiveMember(params.requesterId)) {
            throw new common_1.ForbiddenException('Você não faz parte desta conversa.');
        }
        let affectedUserIds;
        if (params.scope === 'ME') {
            message.deleteForMe(params.requesterId);
            affectedUserIds = [params.requesterId];
        }
        else {
            message.deleteForEveryone(params.requesterId);
            affectedUserIds = conversation.activeParticipants.map((p) => p.userId);
        }
        await this.messageRepository.save(message);
        await (0, publish_to_users_helper_1.publishToUsers)(this.messageBus, affectedUserIds, 'message:deleted', {
            conversationId: conversation.id,
            messageId: message.id,
            scope: params.scope,
        });
    }
};
exports.DeleteMessageUseCase = DeleteMessageUseCase;
exports.DeleteMessageUseCase = DeleteMessageUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [conversation_repository_1.ConversationRepository,
        message_repository_1.MessageRepository,
        message_bus_port_1.MessageBusPublisher])
], DeleteMessageUseCase);
//# sourceMappingURL=delete-message.use-case.js.map