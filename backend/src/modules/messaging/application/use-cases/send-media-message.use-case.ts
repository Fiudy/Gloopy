import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { publishToUsers } from '@shared/application/publish-to-users.helper';
import { MediaAssetRepository } from '@modules/media/domain/repositories/media-asset.repository';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';
import { loadConversationForSending } from '../services/conversation-delivery.helper';

@Injectable()
export class SendMediaMessageUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly mediaAssetRepository: MediaAssetRepository,
    private readonly messageBus: MessageBusPublisher,
  ) {}

  async execute(params: {
    conversationId: string;
    senderId: string;
    mediaAssetId: string;
    caption?: string;
  }): Promise<Message> {
    const mediaAsset = await this.mediaAssetRepository.findById(params.mediaAssetId);
    if (!mediaAsset) {
      throw new NotFoundException('Arquivo não encontrado.');
    }
    // Impede anexar um arquivo que outra pessoa fez upload - o upload em si já
    // exige autenticação, mas isso fecha a brecha de "adivinhar" um mediaAssetId alheio.
    if (mediaAsset.uploaderId !== params.senderId) {
      throw new ForbiddenException('Você não pode anexar um arquivo enviado por outra pessoa.');
    }

    const conversation = await loadConversationForSending(this.conversationRepository, params);

    const message = Message.createMedia(
      {
        conversationId: conversation.id,
        senderId: params.senderId,
        mediaAssetId: mediaAsset.id,
        caption: params.caption,
      },
      uuid(),
    );
    await this.messageRepository.save(message);

    const recipientUserIds = conversation.activeParticipants
      .map((p) => p.userId)
      .filter((id) => id !== params.senderId);

    await publishToUsers(this.messageBus, recipientUserIds, 'message:created', {
      conversationId: conversation.id,
      messageId: message.id,
    });

    return message;
  }
}
