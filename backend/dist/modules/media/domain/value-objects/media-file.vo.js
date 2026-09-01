"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaFile = exports.MAX_FILE_SIZE_BYTES = void 0;
const domain_error_1 = require("../../../../shared/domain/domain-error");
exports.MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;
const KIND_BY_MIME_PREFIX = [
    { prefix: 'image/', kind: 'IMAGE' },
    { prefix: 'video/', kind: 'VIDEO' },
    { prefix: 'audio/', kind: 'AUDIO' },
];
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
class MediaFile {
    constructor(fileName, mimeType, sizeBytes, kind) {
        this.fileName = fileName;
        this.mimeType = mimeType;
        this.sizeBytes = sizeBytes;
        this.kind = kind;
    }
    static create(params) {
        if (params.sizeBytes <= 0) {
            throw new domain_error_1.DomainError('Arquivo vazio ou inválido.');
        }
        if (params.sizeBytes > exports.MAX_FILE_SIZE_BYTES) {
            throw new domain_error_1.DomainError(`O arquivo excede o tamanho máximo permitido de ${exports.MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`);
        }
        const kind = this.resolveKind(params.mimeType);
        if (!kind) {
            throw new domain_error_1.DomainError(`Tipo de arquivo não permitido (${params.mimeType}). Envie imagem, vídeo, áudio ou documento.`);
        }
        return new MediaFile(params.fileName.trim(), params.mimeType, params.sizeBytes, kind);
    }
    static resolveKind(mimeType) {
        const byPrefix = KIND_BY_MIME_PREFIX.find((entry) => mimeType.startsWith(entry.prefix));
        if (byPrefix)
            return byPrefix.kind;
        if (DOCUMENT_MIME_TYPES.has(mimeType))
            return 'DOCUMENT';
        return null;
    }
}
exports.MediaFile = MediaFile;
//# sourceMappingURL=media-file.vo.js.map