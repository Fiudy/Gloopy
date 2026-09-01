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
exports.ListMessagesUseCase = void 0;
const common_1 = require("@nestjs/common");
const conversation_repository_1 = require("../../domain/repositories/conversation.repository");
const message_repository_1 = require("../../domain/repositories/message.repository");
const DEFAULT_PAGE_SIZE = 30;
let ListMessagesUseCase = class ListMessagesUseCase {
    constructor(conversationRepository, messageRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
    }
    async execute(params) {
        const conversation = await this.conversationRepository.findById(params.conversationId);
        if (!conversation) {
            throw new common_1.NotFoundException('Conversa não encontrada.');
        }
        if (!conversation.isActiveMember(params.requesterId)) {
            throw new common_1.ForbiddenException('Você não faz parte desta conversa.');
        }
        const messages = await this.messageRepository.findByConversation(params.conversationId, {
            before: params.before,
            limit: params.limit ?? DEFAULT_PAGE_SIZE,
        });
        return messages.filter((m) => !m.isDeletedFor(params.requesterId));
    }
};
exports.ListMessagesUseCase = ListMessagesUseCase;
exports.ListMessagesUseCase = ListMessagesUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [conversation_repository_1.ConversationRepository,
        message_repository_1.MessageRepository])
], ListMessagesUseCase);
//# sourceMappingURL=list-messages.use-case.js.map