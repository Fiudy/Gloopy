import { DomainError } from '@shared/domain/domain-error';

export type MediaKind = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';

// Regra fechada com o usuário: 100MB por arquivo, para qualquer tipo aceito.
export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

const KIND_BY_MIME_PREFIX: Array<{ prefix: string; kind: MediaKind }> = [
  { prefix: 'image/', kind: 'IMAGE' },
  { prefix: 'video/', kind: 'VIDEO' },
  { prefix: 'audio/', kind: 'AUDIO' },
];

// Documentos: extensão explícita em vez de prefixo de mime (mime de documento varia muito).
const DOCUMENT_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'application/zip',
]);

/**
 * Value Object - garante que um arquivo só existe em memória se respeitar as
 * regras de negócio (tipo permitido + tamanho máximo). Nunca deixa um
 * MediaAsset ser criado a partir de um arquivo inválido.
 */
export class MediaFile {
  private constructor(
    public readonly fileName: string,
    public readonly mimeType: string,
    public readonly sizeBytes: number,
    public readonly kind: MediaKind,
  ) {}

  static create(params: { fileName: string; mimeType: string; sizeBytes: number }): MediaFile {
    if (params.sizeBytes <= 0) {
      throw new DomainError('Arquivo vazio ou inválido.');
    }
    if (params.sizeBytes > MAX_FILE_SIZE_BYTES) {
      throw new DomainError(
        `O arquivo excede o tamanho máximo permitido de ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`,
      );
    }

    const kind = this.resolveKind(params.mimeType);
    if (!kind) {
      throw new DomainError(
        `Tipo de arquivo não permitido (${params.mimeType}). Envie imagem, vídeo, áudio ou documento.`,
      );
    }

    return new MediaFile(params.fileName.trim(), params.mimeType, params.sizeBytes, kind);
  }

  private static resolveKind(mimeType: string): MediaKind | null {
    const byPrefix = KIND_BY_MIME_PREFIX.find((entry) => mimeType.startsWith(entry.prefix));
    if (byPrefix) return byPrefix.kind;
    if (DOCUMENT_MIME_TYPES.has(mimeType)) return 'DOCUMENT';
    return null;
  }
}
