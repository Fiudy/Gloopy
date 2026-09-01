import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client as MinioClient } from 'minio';
import { MediaStorageRepository } from '../../domain/repositories/media-storage.repository';

const DEFAULT_PRESIGNED_URL_EXPIRY_SECONDS = 24 * 60 * 60; // 24h

@Injectable()
export class MinioMediaStorageRepository implements MediaStorageRepository, OnModuleInit {
  private readonly logger = new Logger(MinioMediaStorageRepository.name);
  private readonly client: MinioClient;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.get<string>('MINIO_BUCKET', 'gloopy-media');
    this.client = new MinioClient({
      endPoint: this.config.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: this.config.get<number>('MINIO_PORT', 9000),
      useSSL: this.config.get<string>('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.config.get<string>('MINIO_ACCESS_KEY', 'gloopy'),
      secretKey: this.config.get<string>('MINIO_SECRET_KEY', 'gloopy12345'),
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket);
        this.logger.log(`Bucket "${this.bucket}" criado no MinIO.`);
      }
    } catch (error) {
      // Não derruba a API se o MinIO estiver temporariamente fora - só loga.
      // Upload de mídia vai falhar até o MinIO voltar, mas o resto do app continua.
      this.logger.error(`Falha ao verificar/criar bucket no MinIO: ${(error as Error).message}`);
    }
  }

  async upload(params: { key: string; buffer: Buffer; mimeType: string }): Promise<void> {
    await this.client.putObject(this.bucket, params.key, params.buffer, params.buffer.length, {
      'Content-Type': params.mimeType,
    });
  }

  async getPresignedUrl(key: string, expirySeconds = DEFAULT_PRESIGNED_URL_EXPIRY_SECONDS): Promise<string> {
    return this.client.presignedGetObject(this.bucket, key, expirySeconds);
  }

  async delete(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
  }
}
