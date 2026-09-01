import { MediaAssetRepository } from '../../domain/repositories/media-asset.repository';
import { MediaStorageRepository } from '../../domain/repositories/media-storage.repository';
export interface UploadMediaInput {
    uploaderId: string;
    fileName: string;
    mimeType: string;
    buffer: Buffer;
}
export interface UploadMediaOutput {
    id: string;
    kind: string;
    mimeType: string;
    sizeBytes: number;
    fileName: string;
    url: string;
}
export declare class UploadMediaUseCase {
    private readonly mediaAssetRepository;
    private readonly mediaStorageRepository;
    constructor(mediaAssetRepository: MediaAssetRepository, mediaStorageRepository: MediaStorageRepository);
    execute(input: UploadMediaInput): Promise<UploadMediaOutput>;
}
