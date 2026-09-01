"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.MESSAGE_EDIT_WINDOW_MINUTES = void 0;
const entity_base_1 = require("../../../../shared/domain/entity.base");
const domain_error_1 = require("../../../../shared/domain/domain-error");
const message_content_vo_1 = require("../value-objects/message-content.vo");
exports.MESSAGE_EDIT_WINDOW_MINUTES = 15;
class Message extends entity_base_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static createText(params, id) {
        const content = message_content_vo_1.MessageContent.create(params.content);
        return new Message({
            conversationId: params.conversationId,
            senderId: params.senderId,
            type: 'TEXT',
            systemEvent: null,
            content: content.toString(),
            mediaAssetId: null,
            gameSessionId: null,
            editedAt: null,
            deletedForEveryoneAt: null,
            deletedForUserIds: new Set(),
            createdAt: new Date(),
        }, id);
    }
    static createMedia(params, id) {
        return new Message({
            conversationId: params.conversationId,
            senderId: params.senderId,
            type: 'MEDIA',
            systemEvent: null,
            content: params.caption?.trim() || null,
            mediaAssetId: params.mediaAssetId,
            gameSessionId: null,
            editedAt: null,
            deletedForEveryoneAt: null,
            deletedForUserIds: new Set(),
            createdAt: new Date(),
        }, id);
    }
    static createGameInvite(params, id) {
        return new Message({
            conversationId: params.conversationId,
            senderId: params.senderId,
            type: 'GAME_INVITE',
            systemEvent: null,
            content: params.content,
            mediaAssetId: null,
            gameSessionId: params.gameSessionId,
            editedAt: null,
            deletedForEveryoneAt: null,
            deletedForUserIds: new Set(),
            createdAt: new Date(),
        }, id);
    }
    static createSystem(params, id) {
        return new Message({
            conversationId: params.conversationId,
            senderId: null,
            type: 'SYSTEM',
            systemEvent: params.event,
            content: params.content,
            mediaAssetId: null,
            gameSessionId: null,
            editedAt: null,
            deletedForEveryoneAt: null,
            deletedForUserIds: new Set(),
            createdAt: new Date(),
        }, id);
    }
    static restore(props, id) {
        return new Message(props, id);
    }
    get conversationId() {
        return this.props.conversationId;
    }
    get senderId() {
        return this.props.senderId;
    }
    get type() {
        return this.props.type;
    }
    get content() {
        return this.props.content;
    }
    get mediaAssetId() {
        return this.props.mediaAssetId ?? null;
    }
    get gameSessionId() {
        return this.props.gameSessionId ?? null;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get editedAt() {
        return this.props.editedAt;
    }
    get isDeletedForEveryone() {
        return !!this.props.deletedForEveryoneAt;
    }
    isDeletedFor(userId) {
        return this.props.deletedForUserIds.has(userId) || this.isDeletedForEveryone;
    }
    edit(requesterId, newContent) {
        if (this.props.type !== 'TEXT') {
            throw new domain_error_1.DomainError('Apenas mensagens de texto podem ser editadas.');
        }
        if (this.props.senderId !== requesterId) {
            throw new domain_error_1.DomainError('Apenas quem enviou a mensagem pode editá-la.');
        }
        if (this.isDeletedForEveryone) {
            throw new domain_error_1.DomainError('Não é possível editar uma mensagem apagada.');
        }
        const minutesSinceSent = (Date.now() - this.props.createdAt.getTime()) / 60000;
        if (minutesSinceSent > exports.MESSAGE_EDIT_WINDOW_MINUTES) {
            throw new domain_error_1.DomainError(`O prazo para editar esta mensagem (${exports.MESSAGE_EDIT_WINDOW_MINUTES} minutos) expirou.`);
        }
        this.props.content = message_content_vo_1.MessageContent.create(newContent).toString();
        this.props.editedAt = new Date();
    }
    deleteForMe(userId) {
        this.props.deletedForUserIds.add(userId);
    }
    deleteForEveryone(requesterId) {
        if (this.props.senderId !== requesterId) {
            throw new domain_error_1.DomainError('Apenas quem enviou a mensagem pode apagá-la para todos.');
        }
        this.props.deletedForEveryoneAt = new Date();
    }
    toPersistence() {
        return { id: this.id, ...this.props };
    }
}
exports.Message = Message;
//# sourceMappingURL=message.entity.js.map