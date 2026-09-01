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
exports.SendMediaMessageUseCase = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const message_bus_port_1 = require("../../../../shared/application/message-bus.port");
const publish_to_users_helper_1 = require("../../../../shared/application/publish-to-users.helper");
const media_asset_repository_1 = require("../../../media/domain/repositories/media-asset.repository");
const conversation_repository_1 = require("../../domain/repositories/conversation.repository");
const message_repository_1 = require("../../domain/repositories/message.repository");
const message_entity_1 = require("../../domain/entities/message.entity");
const conversation_delivery_helper_1 = require("../services/conversation-delivery.helper");
let SendMediaMessageUseCase = class SendMediaMessageUseCase {
    constructor(conversationRepository, messageRepository, mediaAssetRepository, messageBus) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.mediaAssetRepository = mediaAssetRepository;
        this.messageBus = messageBus;
    }
    async execute(params) {
        const mediaAsset = await this.mediaAssetRepository.findById(params.mediaAssetId);
        if (!mediaAsset) {
            throw new common_1.NotFoundException('Arquivo não encontrado.');
        }
        if (mediaAsset.uploaderId !== params.senderId) {
            throw new common_1.ForbiddenException('Você não pode anexar um arquivo enviado por outra pessoa.');
        }
        const conversation = await (0, conversation_delivery_helper_1.loadConversationForSending)(this.conversationRepository, params);
        const message = message_entity_1.Message.createMedia({
            conversationId: conversation.id,
            senderId: params.senderId,
            mediaAssetId: mediaAsset.id,
            caption: params.caption,
        }, (0, uuid_1.v4)());
        await this.messageRepository.save(message);
        const recipientUserIds = conversation.activeParticipants
            .map((p) => p.userId)
            .filter((id) => id !== params.senderId);
        await (0, publish_to_users_helper_1.publishToUsers)(this.messageBus, recipientUserIds, 'message:created', {
            conversationId: conversation.id,
            messageId: message.id,
        });
        return message;
    }
};
exports.SendMediaMessageUseCase = SendMediaMessageUseCase;
exports.SendMediaMessageUseCase = SendMediaMessageUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [conversation_repository_1.ConversationRepository,
        message_repository_1.MessageRepository,
        media_asset_repository_1.MediaAssetRepository,
        message_bus_port_1.MessageBusPublisher])
], SendMediaMessageUseCase);
//# sourceMappingURL=send-media-message.use-case.js.map