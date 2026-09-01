import { Injectable } from '@nestjs/common';
import { MediaAssetRepository } from '@modules/media/domain/repositories/media-asset.repository';
import { MediaStorageRepository } from '@modules/media/domain/repositories/media-storage.repository';
import { Message } from '../../domain/entities/message.entity';
import { MessageMediaInfo } from '../mappers/message.mapper';

/**
 * Resolve os dados de mídia (com URL assinada, gerada na hora) para exibir junto
 * das mensagens do tipo MEDIA. Fica na camada de apresentação porque é montagem
 * de resposta de API que cruza dois bounded contexts (Messaging + Media),
 * não regra de negócio de nenhum dos dois.
 */
@Injectable()
export class MessageMediaEnricherService {
  constructor(
    private readonly mediaAssetRepository: MediaAssetRepository,
    private readonly mediaStorageRepository: MediaStorageRepository,
  ) {}

  async resolveFor(messages: Message[]): Promise<Map<string, MessageMediaInfo>> {
    const mediaMessages = messages.filter((m) => m.type === 'MEDIA' && m.mediaAssetId);
    const entries = await Promise.all(
      mediaMessages.map(async (message) => {
        const asset = await this.mediaAssetRepository.findById(message.mediaAssetId as string);
        if (!asset) return null;

        const url = await this.mediaStorageRepository.getPresignedUrl(asset.storageKey);
        const info: MessageMediaInfo = {
          id: asset.id,
          kind: asset.kind,
          mimeType: asset.mimeType,
          sizeBytes: asset.sizeBytes,
          fileName: asset.fileName,
          url,
        };
        return [message.id, info] as const;
      }),
    );

    return new Map(entries.filter((e): e is [string, MessageMediaInfo] => e !== null));
  }
}
