import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaStorageRepository } from '../../domain/repositories/media-storage.repository';
export declare class MinioMediaStorageRepository implements MediaStorageRepository, OnModuleInit {
    private readonly config;
    private readonly logger;
    private readonly client;
    private readonly bucket;
    constructor(config: ConfigService);
    onModuleInit(): Promise<void>;
    upload(params: {
        key: string;
        buffer: Buffer;
        mimeType: string;
    }): Promise<void>;
    getPresignedUrl(key: string, expirySeconds?: number): Promise<string>;
    delete(key: string): Promise<void>;
}
