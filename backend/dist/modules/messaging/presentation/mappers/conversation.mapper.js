"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toConversationResponse = toConversationResponse;
function toConversationResponse(conversation) {
    return {
        id: conversation.id,
        type: conversation.type,
        name: conversation.name,
        avatarUrl: conversation.avatarUrl,
        isPending: conversation.isDirectPending,
        participants: conversation.activeParticipants.map((p) => ({ userId: p.userId, role: p.role })),
    };
}
//# sourceMappingURL=conversation.mapper.js.map