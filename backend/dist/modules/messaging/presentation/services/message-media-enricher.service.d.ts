import { MediaAssetRepository } from '@modules/media/domain/repositories/media-asset.repository';
import { MediaStorageRepository } from '@modules/media/domain/repositories/media-storage.repository';
import { Message } from '../../domain/entities/message.entity';
import { MessageMediaInfo } from '../mappers/message.mapper';
export declare class MessageMediaEnricherService {
    private readonly mediaAssetRepository;
    private readonly mediaStorageRepository;
    constructor(mediaAssetRepository: MediaAssetRepository, mediaStorageRepository: MediaStorageRepository);
    resolveFor(messages: Message[]): Promise<Map<string, MessageMediaInfo>>;
}
