import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { MediaAssetRepository } from '../../domain/repositories/media-asset.repository';
import { MediaAsset, MediaAssetProps } from '../../domain/entities/media-asset.entity';
import { MediaAsset as PrismaMediaAsset } from '@prisma/client';

@Injectable()
export class PrismaMediaAssetRepository implements MediaAssetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<MediaAsset | null> {
    const record = await this.prisma.mediaAsset.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async save(asset: MediaAsset): Promise<void> {
    const data = asset.toPersistence();
    await this.prisma.mediaAsset.upsert({
      where: { id: data.id },
      create: {
        id: data.id,
        uploaderId: data.uploaderId,
        kind: data.kind,
        mimeType: data.mimeType,
        sizeBytes: data.sizeBytes,
        fileName: data.fileName,
        storageKey: data.storageKey,
        createdAt: data.createdAt,
      },
      update: {}, // MediaAsset é imutável após criado
    });
  }

  private toDomain(record: PrismaMediaAsset): MediaAsset {
    const props: MediaAssetProps = {
      uploaderId: record.uploaderId,
      kind: record.kind,
      mimeType: record.mimeType,
      sizeBytes: record.sizeBytes,
      fileName: record.fileName,
      storageKey: record.storageKey,
      createdAt: record.createdAt,
    };
    return MediaAsset.restore(props, record.id);
  }
}
