export type MediaKind = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';
export declare const MAX_FILE_SIZE_BYTES: number;
export declare class MediaFile {
    readonly fileName: string;
    readonly mimeType: string;
    readonly sizeBytes: number;
    readonly kind: MediaKind;
    private constructor();
    static create(params: {
        fileName: string;
        mimeType: string;
        sizeBytes: number;
    }): MediaFile;
    private static resolveKind;
}
