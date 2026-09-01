"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConversationForSending = loadConversationForSending;
const common_1 = require("@nestjs/common");
async function loadConversationForSending(conversationRepository, params) {
    const conversation = await conversationRepository.findById(params.conversationId);
    if (!conversation) {
        throw new common_1.NotFoundException('Conversa não encontrada.');
    }
    if (!conversation.isActiveMember(params.senderId)) {
        throw new common_1.ForbiddenException('Você não faz parte desta conversa.');
    }
    if (conversation.isDirectPending && conversation.initiatorId !== params.senderId) {
        conversation.acceptDirect();
        await conversationRepository.save(conversation);
    }
    return conversation;
}
//# sourceMappingURL=conversation-delivery.helper.js.map