/**
 * Porta de armazenamento de arquivos - hoje implementada com MinIO, mas
 * qualquer serviço S3-compatível (S3 de verdade, Cloudflare R2, etc.) pode
 * substituir sem tocar em domínio ou casos de uso.
 */
export abstract class MediaStorageRepository {
  abstract upload(params: { key: string; buffer: Buffer; mimeType: string }): Promise<void>;

  /** URL temporária e assinada - nunca persistimos URL fixa, sempre geramos sob demanda. */
  abstract getPresignedUrl(key: string, expirySeconds?: number): Promise<string>;

  abstract delete(key: string): Promise<void>;
}
