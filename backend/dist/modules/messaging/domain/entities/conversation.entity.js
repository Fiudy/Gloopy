"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = exports.MAX_GROUP_PARTICIPANTS = void 0;
const entity_base_1 = require("../../../../shared/domain/entity.base");
const domain_error_1 = require("../../../../shared/domain/domain-error");
const participant_1 = require("./participant");
exports.MAX_GROUP_PARTICIPANTS = 1024;
class Conversation extends entity_base_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static createDirect(params, id) {
        if (params.initiatorId === params.recipientId) {
            throw new domain_error_1.DomainError('Não é possível iniciar uma conversa consigo mesmo.');
        }
        const now = new Date();
        return new Conversation({
            type: 'DIRECT',
            name: null,
            avatarUrl: null,
            initiatorId: params.initiatorId,
            acceptedAt: null,
            participants: [participant_1.Participant.join(params.initiatorId), participant_1.Participant.join(params.recipientId)],
            createdAt: now,
            updatedAt: now,
        }, id);
    }
    static createGroup(params, id) {
        const name = params.name.trim();
        if (name.length === 0) {
            throw new domain_error_1.DomainError('O grupo precisa de um nome.');
        }
        const uniqueMemberIds = Array.from(new Set(params.memberIds.filter((m) => m !== params.creatorId)));
        const totalParticipants = uniqueMemberIds.length + 1;
        if (totalParticipants > exports.MAX_GROUP_PARTICIPANTS) {
            throw new domain_error_1.DomainError(`Um grupo pode ter no máximo ${exports.MAX_GROUP_PARTICIPANTS} participantes.`);
        }
        const now = new Date();
        const participants = [
            participant_1.Participant.join(params.creatorId, 'ADMIN'),
            ...uniqueMemberIds.map((userId) => participant_1.Participant.join(userId, 'MEMBER')),
        ];
        return new Conversation({
            type: 'GROUP',
            name,
            avatarUrl: null,
            initiatorId: null,
            acceptedAt: null,
            participants,
            createdAt: now,
            updatedAt: now,
        }, id);
    }
    static restore(props, id) {
        return new Conversation(props, id);
    }
    get type() {
        return this.props.type;
    }
    get name() {
        return this.props.name;
    }
    get avatarUrl() {
        return this.props.avatarUrl;
    }
    get initiatorId() {
        return this.props.initiatorId;
    }
    get isDirectPending() {
        return this.props.type === 'DIRECT' && this.props.acceptedAt === null;
    }
    get activeParticipants() {
        return this.props.participants.filter((p) => p.isActive);
    }
    findParticipant(userId) {
        return this.props.participants.find((p) => p.userId === userId);
    }
    isActiveMember(userId) {
        const participant = this.findParticipant(userId);
        return !!participant && participant.isActive;
    }
    acceptDirect() {
        if (this.props.type !== 'DIRECT')
            return;
        if (this.props.acceptedAt === null) {
            this.props.acceptedAt = new Date();
        }
    }
    assertIsGroup() {
        if (this.props.type !== 'GROUP') {
            throw new domain_error_1.DomainError('Esta operação só é válida para grupos.');
        }
    }
    assertIsActiveAdmin(userId) {
        const participant = this.findParticipant(userId);
        if (!participant || !participant.isActive || !participant.isAdmin) {
            throw new domain_error_1.DomainError('Apenas administradores do grupo podem realizar esta ação.');
        }
    }
    countActiveAdmins() {
        return this.activeParticipants.filter((p) => p.isAdmin).length;
    }
    addParticipant(requesterId, newUserId) {
        this.assertIsGroup();
        this.assertIsActiveAdmin(requesterId);
        if (this.isActiveMember(newUserId)) {
            throw new domain_error_1.DomainError('Este usuário já faz parte do grupo.');
        }
        if (this.activeParticipants.length + 1 > exports.MAX_GROUP_PARTICIPANTS) {
            throw new domain_error_1.DomainError(`Um grupo pode ter no máximo ${exports.MAX_GROUP_PARTICIPANTS} participantes.`);
        }
        const existing = this.findParticipant(newUserId);
        if (existing) {
            existing.leftAt = null;
            existing.removedByUserId = null;
            existing.role = 'MEMBER';
        }
        else {
            this.props.participants.push(participant_1.Participant.join(newUserId));
        }
        this.props.updatedAt = new Date();
    }
    removeParticipant(requesterId, targetUserId) {
        this.assertIsGroup();
        this.assertIsActiveAdmin(requesterId);
        if (requesterId === targetUserId) {
            throw new domain_error_1.DomainError('Para sair do grupo, use a ação de sair - não a de remover.');
        }
        const target = this.findParticipant(targetUserId);
        if (!target || !target.isActive) {
            throw new domain_error_1.DomainError('Este usuário não faz parte do grupo.');
        }
        if (target.isAdmin && this.countActiveAdmins() <= 1) {
            throw new domain_error_1.DomainError('Não é possível remover o único administrador restante do grupo.');
        }
        target.leftAt = new Date();
        target.removedByUserId = requesterId;
        this.props.updatedAt = new Date();
    }
    leave(userId) {
        this.assertIsGroup();
        const participant = this.findParticipant(userId);
        if (!participant || !participant.isActive) {
            throw new domain_error_1.DomainError('Você não faz parte deste grupo.');
        }
        const wasLastAdmin = participant.isAdmin && this.countActiveAdmins() <= 1;
        participant.leftAt = new Date();
        participant.removedByUserId = null;
        if (wasLastAdmin) {
            const nextInLine = this.activeParticipants.sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime())[0];
            if (nextInLine) {
                nextInLine.role = 'ADMIN';
            }
        }
        this.props.updatedAt = new Date();
    }
    promoteToAdmin(requesterId, targetUserId) {
        this.assertIsGroup();
        this.assertIsActiveAdmin(requesterId);
        const target = this.findParticipant(targetUserId);
        if (!target || !target.isActive) {
            throw new domain_error_1.DomainError('Este usuário não faz parte do grupo.');
        }
        target.role = 'ADMIN';
        this.props.updatedAt = new Date();
    }
    demoteAdmin(requesterId, targetUserId) {
        this.assertIsGroup();
        this.assertIsActiveAdmin(requesterId);
        const target = this.findParticipant(targetUserId);
        if (!target || !target.isActive || !target.isAdmin) {
            throw new domain_error_1.DomainError('Este usuário não é administrador do grupo.');
        }
        if (this.countActiveAdmins() <= 1) {
            throw new domain_error_1.DomainError('O grupo precisa de pelo menos um administrador.');
        }
        target.role = 'MEMBER';
        this.props.updatedAt = new Date();
    }
    rename(requesterId, newName) {
        this.assertIsGroup();
        this.assertIsActiveAdmin(requesterId);
        const trimmed = newName.trim();
        if (trimmed.length === 0) {
            throw new domain_error_1.DomainError('O nome do grupo não pode ser vazio.');
        }
        this.props.name = trimmed;
        this.props.updatedAt = new Date();
    }
    changeAvatar(requesterId, avatarUrl) {
        this.assertIsGroup();
        this.assertIsActiveAdmin(requesterId);
        this.props.avatarUrl = avatarUrl;
        this.props.updatedAt = new Date();
    }
    toPersistence() {
        return { id: this.id, ...this.props };
    }
}
exports.Conversation = Conversation;
//# sourceMappingURL=conversation.entity.js.map