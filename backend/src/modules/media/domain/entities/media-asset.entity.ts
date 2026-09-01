import { Entity } from '@shared/domain/entity.base';
import { MediaFile, MediaKind } from '../value-objects/media-file.vo';

export interface MediaAssetProps {
  uploaderId: string;
  kind: MediaKind;
  mimeType: string;
  sizeBytes: number;
  fileName: string;
  storageKey: string;
  createdAt: Date;
}

export class MediaAsset extends Entity<MediaAssetProps> {
  private constructor(props: MediaAssetProps, id: string) {
    super(props, id);
  }

  static create(
    params: { uploaderId: string; file: MediaFile; storageKey: string },
    id: string,
  ): MediaAsset {
    return new MediaAsset(
      {
        uploaderId: params.uploaderId,
        kind: params.file.kind,
        mimeType: params.file.mimeType,
        sizeBytes: params.file.sizeBytes,
        fileName: params.file.fileName,
        storageKey: params.storageKey,
        createdAt: new Date(),
      },
      id,
    );
  }

  static restore(props: MediaAssetProps, id: string): MediaAsset {
    return new MediaAsset(props, id);
  }

  get uploaderId(): string {
    return this.props.uploaderId;
  }

  get kind(): MediaKind {
    return this.props.kind;
  }

  get mimeType(): string {
    return this.props.mimeType;
  }

  get sizeBytes(): number {
    return this.props.sizeBytes;
  }

  get fileName(): string {
    return this.props.fileName;
  }

  get storageKey(): string {
    return this.props.storageKey;
  }

  toPersistence() {
    return { id: this.id, ...this.props };
  }
}
