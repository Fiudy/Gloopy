export declare abstract class MediaStorageRepository {
    abstract upload(params: {
        key: string;
        buffer: Buffer;
        mimeType: string;
    }): Promise<void>;
    abstract getPresignedUrl(key: string, expirySeconds?: number): Promise<string>;
    abstract delete(key: string): Promise<void>;
}
