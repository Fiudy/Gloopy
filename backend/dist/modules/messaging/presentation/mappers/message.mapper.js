"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMessageResponse = toMessageResponse;
function toMessageResponse(message, viewerId, mediaInfo) {
    const isDeleted = message.isDeletedFor(viewerId);
    return {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        type: message.type,
        content: isDeleted ? null : message.content,
        media: isDeleted ? null : mediaInfo ?? null,
        gameSessionId: isDeleted ? null : message.gameSessionId,
        editedAt: message.editedAt ? message.editedAt.toISOString() : null,
        createdAt: message.createdAt.toISOString(),
    };
}
//# sourceMappingURL=message.mapper.js.map