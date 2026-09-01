import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { MediaAssetRepository } from '../../domain/repositories/media-asset.repository';
import { MediaStorageRepository } from '../../domain/repositories/media-storage.repository';
import { MediaAsset } from '../../domain/entities/media-asset.entity';
import { MediaFile } from '../../domain/value-objects/media-file.vo';

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

@Injectable()
export class UploadMediaUseCase {
  constructor(
    private readonly mediaAssetRepository: MediaAssetRepository,
    private readonly mediaStorageRepository: MediaStorageRepository,
  ) {}

  async execute(input: UploadMediaInput): Promise<UploadMediaOutput> {
    // Lança DomainError se o tipo não for permitido ou o tamanho exceder o limite.
    const file = MediaFile.create({
      fileName: input.fileName,
      mimeType: input.mimeType,
      sizeBytes: input.buffer.length,
    });

    const id = uuid();
    // Chave de armazenamento previsível e sem colisão: <uploaderId>/<assetId>-<nomeOriginal>
    const storageKey = `${input.uploaderId}/${id}-${sanitizeFileName(file.fileName)}`;

    await this.mediaStorageRepository.upload({ key: storageKey, buffer: input.buffer, mimeType: file.mimeType });

    const asset = MediaAsset.create({ uploaderId: input.uploaderId, file, storageKey }, id);
    try {
      await this.mediaAssetRepository.save(asset);
    } catch (error) {
      await this.mediaStorageRepository.delete(storageKey).catch(() => undefined);
      throw error;
    }

    const url = await this.mediaStorageRepository.getPresignedUrl(storageKey);

    return {
      id: asset.id,
      kind: asset.kind,
      mimeType: asset.mimeType,
      sizeBytes: asset.sizeBytes,
      fileName: asset.fileName,
      url,
    };
  }
}

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120);
}
