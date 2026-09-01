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
exports.ManageParticipantsUseCase = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const message_bus_port_1 = require("../../../../shared/application/message-bus.port");
const publish_to_users_helper_1 = require("../../../../shared/application/publish-to-users.helper");
const conversation_repository_1 = require("../../domain/repositories/conversation.repository");
const message_repository_1 = require("../../domain/repositories/message.repository");
const message_entity_1 = require("../../domain/entities/message.entity");
let ManageParticipantsUseCase = class ManageParticipantsUseCase {
    constructor(conversationRepository, messageRepository, messageBus) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.messageBus = messageBus;
    }
    async addParticipant(params) {
        const conversation = await this.loadConversation(params.conversationId);
        conversation.addParticipant(params.requesterId, params.newUserId);
        await this.conversationRepository.save(conversation);
        await this.emitSystemMessage(conversation.id, 'PARTICIPANT_JOINED', 'Um novo participante entrou no grupo.');
        await this.notify(conversation.id, conversation.activeParticipants.map((p) => p.userId));
    }
    async removeParticipant(params) {
        const conversation = await this.loadConversation(params.conversationId);
        const recipientsBefore = conversation.activeParticipants.map((p) => p.userId);
        conversation.removeParticipant(params.requesterId, params.targetUserId);
        await this.conversationRepository.save(conversation);
        await this.emitSystemMessage(conversation.id, 'PARTICIPANT_REMOVED', 'Um participante foi removido do grupo.');
        await this.notify(conversation.id, recipientsBefore);
    }
    async leave(params) {
        const conversation = await this.loadConversation(params.conversationId);
        const recipientsBefore = conversation.activeParticipants.map((p) => p.userId);
        conversation.leave(params.userId);
        await this.conversationRepository.save(conversation);
        await this.emitSystemMessage(conversation.id, 'PARTICIPANT_LEFT', 'Um participante saiu do grupo.');
        await this.notify(conversation.id, recipientsBefore);
    }
    async promoteToAdmin(params) {
        const conversation = await this.loadConversation(params.conversationId);
        conversation.promoteToAdmin(params.requesterId, params.targetUserId);
        await this.conversationRepository.save(conversation);
        await this.emitSystemMessage(conversation.id, 'ADMIN_PROMOTED', 'Um participante virou administrador.');
        await this.notify(conversation.id, conversation.activeParticipants.map((p) => p.userId));
    }
    async demoteAdmin(params) {
        const conversation = await this.loadConversation(params.conversationId);
        conversation.demoteAdmin(params.requesterId, params.targetUserId);
        await this.conversationRepository.save(conversation);
        await this.emitSystemMessage(conversation.id, 'ADMIN_DEMOTED', 'Um administrador foi rebaixado a membro.');
        await this.notify(conversation.id, conversation.activeParticipants.map((p) => p.userId));
    }
    async renameGroup(params) {
        const conversation = await this.loadConversation(params.conversationId);
        conversation.rename(params.requesterId, params.name);
        await this.conversationRepository.save(conversation);
        await this.emitSystemMessage(conversation.id, 'GROUP_RENAMED', `O grupo agora se chama "${conversation.name}".`);
        await this.notify(conversation.id, conversation.activeParticipants.map((participant) => participant.userId));
        return conversation;
    }
    async loadConversation(conversationId) {
        const conversation = await this.conversationRepository.findById(conversationId);
        if (!conversation) {
            throw new common_1.NotFoundException('Conversa não encontrada.');
        }
        return conversation;
    }
    async emitSystemMessage(conversationId, event, content) {
        const systemMessage = message_entity_1.Message.createSystem({ conversationId, event, content }, (0, uuid_1.v4)());
        await this.messageRepository.save(systemMessage);
    }
    async notify(conversationId, recipientUserIds) {
        await (0, publish_to_users_helper_1.publishToUsers)(this.messageBus, recipientUserIds, 'conversation:participants_changed', {
            conversationId,
        });
    }
};
exports.ManageParticipantsUseCase = ManageParticipantsUseCase;
exports.ManageParticipantsUseCase = ManageParticipantsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [conversation_repository_1.ConversationRepository,
        message_repository_1.MessageRepository,
        message_bus_port_1.MessageBusPublisher])
], ManageParticipantsUseCase);
//# sourceMappingURL=manage-participants.use-case.js.map