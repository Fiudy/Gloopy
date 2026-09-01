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
exports.InviteToGameUseCase = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const domain_error_1 = require("../../../../shared/domain/domain-error");
const message_bus_port_1 = require("../../../../shared/application/message-bus.port");
const publish_to_users_helper_1 = require("../../../../shared/application/publish-to-users.helper");
const conversation_repository_1 = require("../../../messaging/domain/repositories/conversation.repository");
const message_repository_1 = require("../../../messaging/domain/repositories/message.repository");
const message_entity_1 = require("../../../messaging/domain/entities/message.entity");
const conversation_delivery_helper_1 = require("../../../messaging/application/services/conversation-delivery.helper");
const game_session_repository_1 = require("../../domain/repositories/game-session.repository");
const game_session_entity_1 = require("../../domain/entities/game-session.entity");
let InviteToGameUseCase = class InviteToGameUseCase {
    constructor(conversationRepository, messageRepository, gameSessionRepository, messageBus) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.gameSessionRepository = gameSessionRepository;
        this.messageBus = messageBus;
    }
    async execute(params) {
        const conversation = await (0, conversation_delivery_helper_1.loadConversationForSending)(this.conversationRepository, {
            conversationId: params.conversationId,
            senderId: params.inviterId,
        });
        if (!conversation.isActiveMember(params.opponentId)) {
            throw new domain_error_1.DomainError('O oponente precisa fazer parte da conversa.');
        }
        const session = game_session_entity_1.GameSession.invite({ conversationId: conversation.id, invitedByUserId: params.inviterId, opponentId: params.opponentId }, (0, uuid_1.v4)());
        await this.gameSessionRepository.save(session);
        const inviteMessage = message_entity_1.Message.createGameInvite({
            conversationId: conversation.id,
            senderId: params.inviterId,
            gameSessionId: session.id,
            content: 'Convite para jogo da velha 🎮',
        }, (0, uuid_1.v4)());
        await this.messageRepository.save(inviteMessage);
        const recipientUserIds = conversation.activeParticipants
            .map((p) => p.userId)
            .filter((id) => id !== params.inviterId);
        await (0, publish_to_users_helper_1.publishToUsers)(this.messageBus, recipientUserIds, 'message:created', {
            conversationId: conversation.id,
            messageId: inviteMessage.id,
        });
        return session;
    }
};
exports.InviteToGameUseCase = InviteToGameUseCase;
exports.InviteToGameUseCase = InviteToGameUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [conversation_repository_1.ConversationRepository,
        message_repository_1.MessageRepository,
        game_session_repository_1.GameSessionRepository,
        message_bus_port_1.MessageBusPublisher])
], InviteToGameUseCase);
//# sourceMappingURL=invite-to-game.use-case.js.map