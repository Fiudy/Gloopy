import { Module } from '@nestjs/common';
import { MediaController } from './presentation/media.controller';
import { UploadMediaUseCase } from './application/use-cases/upload-media.use-case';
import { MediaAssetRepository } from './domain/repositories/media-asset.repository';
import { MediaStorageRepository } from './domain/repositories/media-storage.repository';
import { PrismaMediaAssetRepository } from './infrastructure/persistence/prisma-media-asset.repository';
import { MinioMediaStorageRepository } from './infrastructure/storage/minio-media-storage.repository';

@Module({
  controllers: [MediaController],
  providers: [
    UploadMediaUseCase,
    { provide: MediaAssetRepository, useClass: PrismaMediaAssetRepository },
    { provide: MediaStorageRepository, useClass: MinioMediaStorageRepository },
  ],
  exports: [MediaAssetRepository, MediaStorageRepository],
})
export class MediaModule {}
