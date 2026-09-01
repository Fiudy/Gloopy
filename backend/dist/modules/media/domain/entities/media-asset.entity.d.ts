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
export declare class MediaAsset extends Entity<MediaAssetProps> {
    private constructor();
    static create(params: {
        uploaderId: string;
        file: MediaFile;
        storageKey: string;
    }, id: string): MediaAsset;
    static restore(props: MediaAssetProps, id: string): MediaAsset;
    get uploaderId(): string;
    get kind(): MediaKind;
    get mimeType(): string;
    get sizeBytes(): number;
    get fileName(): string;
    get storageKey(): string;
    toPersistence(): {
        uploaderId: string;
        kind: MediaKind;
        mimeType: string;
        sizeBytes: number;
        fileName: string;
        storageKey: string;
        createdAt: Date;
        id: string;
    };
}
