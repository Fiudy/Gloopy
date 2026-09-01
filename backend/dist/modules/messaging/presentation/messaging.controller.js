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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const create_direct_conversation_dto_1 = require("../application/dto/create-direct-conversation.dto");
const create_group_conversation_dto_1 = require("../application/dto/create-group-conversation.dto");
const send_message_dto_1 = require("../application/dto/send-message.dto");
const send_media_message_dto_1 = require("../application/dto/send-media-message.dto");
const rename_group_dto_1 = require("../application/dto/rename-group.dto");
const list_messages_query_dto_1 = require("../application/dto/list-messages-query.dto");
const delete_message_query_dto_1 = require("../application/dto/delete-message-query.dto");
const edit_message_dto_1 = require("../application/dto/edit-message.dto");
const create_direct_conversation_use_case_1 = require("../application/use-cases/create-direct-conversation.use-case");
const create_group_conversation_use_case_1 = require("../application/use-cases/create-group-conversation.use-case");
const send_message_use_case_1 = require("../application/use-cases/send-message.use-case");
const send_media_message_use_case_1 = require("../application/use-cases/send-media-message.use-case");
const edit_message_use_case_1 = require("../application/use-cases/edit-message.use-case");
const delete_message_use_case_1 = require("../application/use-cases/delete-message.use-case");
const list_conversations_use_case_1 = require("../application/use-cases/list-conversations.use-case");
const list_messages_use_case_1 = require("../application/use-cases/list-messages.use-case");
const mark_message_read_use_case_1 = require("../application/use-cases/mark-message-read.use-case");
const manage_participants_use_case_1 = require("../application/use-cases/manage-participants.use-case");
const conversation_mapper_1 = require("./mappers/conversation.mapper");
const message_mapper_1 = require("./mappers/message.mapper");
const message_media_enricher_service_1 = require("./services/message-media-enricher.service");
let MessagingController = class MessagingController {
    constructor(createDirectConversation, createGroupConversation, sendMessage, sendMediaMessage, editMessage, deleteMessage, listConversations, listMessages, markMessageRead, manageParticipants, mediaEnricher) {
        this.createDirectConversation = createDirectConversation;
        this.createGroupConversation = createGroupConversation;
        this.sendMessage = sendMessage;
        this.sendMediaMessage = sendMediaMessage;
        this.editMessage = editMessage;
        this.deleteMessage = deleteMessage;
        this.listConversations = listConversations;
        this.listMessages = listMessages;
        this.markMessageRead = markMessageRead;
        this.manageParticipants = manageParticipants;
        this.mediaEnricher = mediaEnricher;
    }
    async listMyConversations(userId) {
        const conversations = await this.listConversations.execute(userId);
        return conversations.map(conversation_mapper_1.toConversationResponse);
    }
    async createDirect(userId, dto) {
        const conversation = await this.createDirectConversation.execute({
            initiatorId: userId,
            recipientId: dto.recipientId,
        });
        return (0, conversation_mapper_1.toConversationResponse)(conversation);
    }
    async createGroup(userId, dto) {
        const conversation = await this.createGroupConversation.execute({
            creatorId: userId,
            name: dto.name,
            memberIds: dto.memberIds,
        });
        return (0, conversation_mapper_1.toConversationResponse)(conversation);
    }
    async listConversationMessages(userId, conversationId, query) {
        const messages = await this.listMessages.execute({
            conversationId,
            requesterId: userId,
            before: query.before ? new Date(query.before) : undefined,
            limit: query.limit,
        });
        const mediaByMessageId = await this.mediaEnricher.resolveFor(messages);
        return messages.map((m) => (0, message_mapper_1.toMessageResponse)(m, userId, mediaByMessageId.get(m.id)));
    }
    async postMessage(userId, conversationId, dto) {
        const message = await this.sendMessage.execute({
            conversationId,
            senderId: userId,
            content: dto.content,
        });
        return (0, message_mapper_1.toMessageResponse)(message, userId);
    }
    async postMediaMessage(userId, conversationId, dto) {
        const message = await this.sendMediaMessage.execute({
            conversationId,
            senderId: userId,
            mediaAssetId: dto.mediaAssetId,
            caption: dto.caption,
        });
        const mediaByMessageId = await this.mediaEnricher.resolveFor([message]);
        return (0, message_mapper_1.toMessageResponse)(message, userId, mediaByMessageId.get(message.id));
    }
    async patchMessage(userId, messageId, dto) {
        const message = await this.editMessage.execute({
            messageId,
            requesterId: userId,
            content: dto.content,
        });
        return (0, message_mapper_1.toMessageResponse)(message, userId);
    }
    async removeMessage(userId, messageId, query) {
        await this.deleteMessage.execute({ messageId, requesterId: userId, scope: query.scope });
    }
    async renameGroup(requesterId, conversationId, dto) {
        const conversation = await this.manageParticipants.renameGroup({ conversationId, requesterId, name: dto.name });
        return (0, conversation_mapper_1.toConversationResponse)(conversation);
    }
    async readMessage(userId, messageId) {
        await this.markMessageRead.execute({ messageId, userId });
    }
    async addParticipant(requesterId, conversationId, newUserId) {
        await this.manageParticipants.addParticipant({ conversationId, requesterId, newUserId });
    }
    async removeParticipant(requesterId, conversationId, targetUserId) {
        await this.manageParticipants.removeParticipant({ conversationId, requesterId, targetUserId });
    }
    async leaveConversation(userId, conversationId) {
        await this.manageParticipants.leave({ conversationId, userId });
    }
    async promoteAdmin(requesterId, conversationId, targetUserId) {
        await this.manageParticipants.promoteToAdmin({ conversationId, requesterId, targetUserId });
    }
    async demoteAdmin(requesterId, conversationId, targetUserId) {
        await this.manageParticipants.demoteAdmin({ conversationId, requesterId, targetUserId });
    }
};
exports.MessagingController = MessagingController;
__decorate([
    (0, common_1.Get)('conversations'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "listMyConversations", null);
__decorate([
    (0, common_1.Post)('conversations/direct'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_direct_conversation_dto_1.CreateDirectConversationDto]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "createDirect", null);
__decorate([
    (0, common_1.Post)('conversations/group'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_group_conversation_dto_1.CreateGroupConversationDto]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Get)('conversations/:id/messages'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, list_messages_query_dto_1.ListMessagesQueryDto]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "listConversationMessages", null);
__decorate([
    (0, common_1.Post)('conversations/:id/messages'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "postMessage", null);
__decorate([
    (0, common_1.Post)('conversations/:id/media-messages'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, send_media_message_dto_1.SendMediaMessageDto]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "postMediaMessage", null);
__decorate([
    (0, common_1.Patch)('messages/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, edit_message_dto_1.EditMessageDto]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "patchMessage", null);
__decorate([
    (0, common_1.Delete)('messages/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, delete_message_query_dto_1.DeleteMessageQueryDto]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "removeMessage", null);
__decorate([
    (0, common_1.Patch)('conversations/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, rename_group_dto_1.RenameGroupDto]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "renameGroup", null);
__decorate([
    (0, common_1.Post)('messages/:id/read'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "readMessage", null);
__decorate([
    (0, common_1.Post)('conversations/:id/participants/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "addParticipant", null);
__decorate([
    (0, common_1.Delete)('conversations/:id/participants/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "removeParticipant", null);
__decorate([
    (0, common_1.Post)('conversations/:id/leave'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "leaveConversation", null);
__decorate([
    (0, common_1.Post)('conversations/:id/participants/:userId/promote'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "promoteAdmin", null);
__decorate([
    (0, common_1.Post)('conversations/:id/participants/:userId/demote'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "demoteAdmin", null);
exports.MessagingController = MessagingController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [create_direct_conversation_use_case_1.CreateDirectConversationUseCase,
        create_group_conversation_use_case_1.CreateGroupConversationUseCase,
        send_message_use_case_1.SendMessageUseCase,
        send_media_message_use_case_1.SendMediaMessageUseCase,
        edit_message_use_case_1.EditMessageUseCase,
        delete_message_use_case_1.DeleteMessageUseCase,
        list_conversations_use_case_1.ListConversationsUseCase,
        list_messages_use_case_1.ListMessagesUseCase,
        mark_message_read_use_case_1.MarkMessageReadUseCase,
        manage_participants_use_case_1.ManageParticipantsUseCase,
        message_media_enricher_service_1.MessageMediaEnricherService])
], MessagingController);
//# sourceMappingURL=messaging.controller.js.map