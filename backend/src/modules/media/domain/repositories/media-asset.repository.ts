import { MediaAsset } from '../entities/media-asset.entity';

export abstract class MediaAssetRepository {
  abstract findById(id: string): Promise<MediaAsset | null>;
  abstract save(asset: MediaAsset): Promise<void>;
}
