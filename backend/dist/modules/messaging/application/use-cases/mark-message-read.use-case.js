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
exports.MarkMessageReadUseCase = void 0;
const common_1 = require("@nestjs/common");
const conversation_repository_1 = require("../../domain/repositories/conversation.repository");
const message_repository_1 = require("../../domain/repositories/message.repository");
const user_repository_1 = require("../../../identity/domain/repositories/user.repository");
let MarkMessageReadUseCase = class MarkMessageReadUseCase {
    constructor(conversationRepository, messageRepository, userRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }
    async execute(params) {
        const message = await this.messageRepository.findById(params.messageId);
        if (!message) {
            throw new common_1.NotFoundException('Mensagem não encontrada.');
        }
        const conversation = await this.conversationRepository.findById(message.conversationId);
        if (!conversation || !conversation.isActiveMember(params.userId)) {
            throw new common_1.ForbiddenException('Você não faz parte desta conversa.');
        }
        const user = await this.userRepository.findById(params.userId);
        if (!user?.readReceiptsEnabled)
            return;
        await this.messageRepository.markRead(params.messageId, params.userId);
    }
};
exports.MarkMessageReadUseCase = MarkMessageReadUseCase;
exports.MarkMessageReadUseCase = MarkMessageReadUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [conversation_repository_1.ConversationRepository,
        message_repository_1.MessageRepository,
        user_repository_1.UserRepository])
], MarkMessageReadUseCase);
//# sourceMappingURL=mark-message-read.use-case.js.map