import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { MediaAssetRepository } from '../../domain/repositories/media-asset.repository';
import { MediaAsset } from '../../domain/entities/media-asset.entity';
export declare class PrismaMediaAssetRepository implements MediaAssetRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<MediaAsset | null>;
    save(asset: MediaAsset): Promise<void>;
    private toDomain;
}
