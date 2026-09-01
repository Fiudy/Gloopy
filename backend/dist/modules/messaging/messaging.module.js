"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingModule = void 0;
const common_1 = require("@nestjs/common");
const media_module_1 = require("../media/media.module");
const identity_module_1 = require("../identity/identity.module");
const messaging_controller_1 = require("./presentation/messaging.controller");
const message_media_enricher_service_1 = require("./presentation/services/message-media-enricher.service");
const conversation_repository_1 = require("./domain/repositories/conversation.repository");
const message_repository_1 = require("./domain/repositories/message.repository");
const prisma_conversation_repository_1 = require("./infrastructure/persistence/prisma-conversation.repository");
const prisma_message_repository_1 = require("./infrastructure/persistence/prisma-message.repository");
const create_direct_conversation_use_case_1 = require("./application/use-cases/create-direct-conversation.use-case");
const create_group_conversation_use_case_1 = require("./application/use-cases/create-group-conversation.use-case");
const send_message_use_case_1 = require("./application/use-cases/send-message.use-case");
const send_media_message_use_case_1 = require("./application/use-cases/send-media-message.use-case");
const edit_message_use_case_1 = require("./application/use-cases/edit-message.use-case");
const delete_message_use_case_1 = require("./application/use-cases/delete-message.use-case");
const list_conversations_use_case_1 = require("./application/use-cases/list-conversations.use-case");
const list_messages_use_case_1 = require("./application/use-cases/list-messages.use-case");
const mark_message_read_use_case_1 = require("./application/use-cases/mark-message-read.use-case");
const manage_participants_use_case_1 = require("./application/use-cases/manage-participants.use-case");
let MessagingModule = class MessagingModule {
};
exports.MessagingModule = MessagingModule;
exports.MessagingModule = MessagingModule = __decorate([
    (0, common_1.Module)({
        imports: [media_module_1.MediaModule, identity_module_1.IdentityModule],
        controllers: [messaging_controller_1.MessagingController],
        providers: [
            { provide: conversation_repository_1.ConversationRepository, useClass: prisma_conversation_repository_1.PrismaConversationRepository },
            { provide: message_repository_1.MessageRepository, useClass: prisma_message_repository_1.PrismaMessageRepository },
            create_direct_conversation_use_case_1.CreateDirectConversationUseCase,
            create_group_conversation_use_case_1.CreateGroupConversationUseCase,
            send_message_use_case_1.SendMessageUseCase,
            send_media_message_use_case_1.SendMediaMessageUseCase,
            edit_message_use_case_1.EditMessageUseCase,
            delete_message_use_case_1.DeleteMessageUseCase,
            list_conversations_use_case_1.ListConversationsUseCase,
            list_messages_use_case_1.ListMessagesUseCase,
            mark_message_read_use_case_1.MarkMessageReadUseCase,
            manage_participants_use_case_1.ManageParticipantsUseCase,
            message_media_enricher_service_1.MessageMediaEnricherService,
        ],
        exports: [conversation_repository_1.ConversationRepository, message_repository_1.MessageRepository],
    })
], MessagingModule);
//# sourceMappingURL=messaging.module.js.map