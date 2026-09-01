"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toGameSessionResponse = toGameSessionResponse;
function toGameSessionResponse(session) {
    return {
        id: session.id,
        conversationId: session.conversationId,
        status: session.status,
        playerXId: session.playerXId,
        playerOId: session.playerOId,
        currentTurnUserId: session.currentTurnUserId,
        winnerUserId: session.winnerUserId,
        board: session.board,
    };
}
//# sourceMappingURL=game-session.mapper.js.map