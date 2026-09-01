import { Module } from '@nestjs/common';
import { MediaModule } from '@modules/media/media.module';
import { IdentityModule } from '@modules/identity/identity.module';
import { MessagingController } from './presentation/messaging.controller';
import { MessageMediaEnricherService } from './presentation/services/message-media-enricher.service';
import { ConversationRepository } from './domain/repositories/conversation.repository';
import { MessageRepository } from './domain/repositories/message.repository';
import { PrismaConversationRepository } from './infrastructure/persistence/prisma-conversation.repository';
import { PrismaMessageRepository } from './infrastructure/persistence/prisma-message.repository';
import { CreateDirectConversationUseCase } from './application/use-cases/create-direct-conversation.use-case';
import { CreateGroupConversationUseCase } from './application/use-cases/create-group-conversation.use-case';
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { SendMediaMessageUseCase } from './application/use-cases/send-media-message.use-case';
import { EditMessageUseCase } from './application/use-cases/edit-message.use-case';
import { DeleteMessageUseCase } from './application/use-cases/delete-message.use-case';
import { ListConversationsUseCase } from './application/use-cases/list-conversations.use-case';
import { ListMessagesUseCase } from './application/use-cases/list-messages.use-case';
import { MarkMessageReadUseCase } from './application/use-cases/mark-message-read.use-case';
import { ManageParticipantsUseCase } from './application/use-cases/manage-participants.use-case';

@Module({
  imports: [MediaModule, IdentityModule],
  controllers: [MessagingController],
  providers: [
    { provide: ConversationRepository, useClass: PrismaConversationRepository },
    { provide: MessageRepository, useClass: PrismaMessageRepository },
    CreateDirectConversationUseCase,
    CreateGroupConversationUseCase,
    SendMessageUseCase,
    SendMediaMessageUseCase,
    EditMessageUseCase,
    DeleteMessageUseCase,
    ListConversationsUseCase,
    ListMessagesUseCase,
    MarkMessageReadUseCase,
    ManageParticipantsUseCase,
    MessageMediaEnricherService,
  ],
  exports: [ConversationRepository, MessageRepository],
})
export class MessagingModule {}
