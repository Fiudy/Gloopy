"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadMediaUseCase = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const media_asset_repository_1 = require("../../domain/repositories/media-asset.repository");
const media_storage_repository_1 = require("../../domain/repositories/media-storage.repository");
const media_asset_entity_1 = require("../../domain/entities/media-asset.entity");
const media_file_vo_1 = require("../../domain/value-objects/media-file.vo");
let UploadMediaUseCase = class UploadMediaUseCase {
    constructor(mediaAssetRepository, mediaStorageRepository) {
        this.mediaAssetRepository = mediaAssetRepository;
        this.mediaStorageRepository = mediaStorageRepository;
    }
    async execute(input) {
        const file = media_file_vo_1.MediaFile.create({
            fileName: input.fileName,
            mimeType: input.mimeType,
            sizeBytes: input.buffer.length,
        });
        const id = (0, uuid_1.v4)();
        const storageKey = `${input.uploaderId}/${id}-${sanitizeFileName(file.fileName)}`;
        await this.mediaStorageRepository.upload({ key: storageKey, buffer: input.buffer, mimeType: file.mimeType });
        const asset = media_asset_entity_1.MediaAsset.create({ uploaderId: input.uploaderId, file, storageKey }, id);
        try {
            await this.mediaAssetRepository.save(asset);
        }
        catch (error) {
            await this.mediaStorageRepository.delete(storageKey).catch(() => undefined);
            throw error;
        }
        const url = await this.mediaStorageRepository.getPresignedUrl(storageKey);
        return {
            id: asset.id,
            kind: asset.kind,
            mimeType: asset.mimeType,
            sizeBytes: asset.sizeBytes,
            fileName: asset.fileName,
            url,
        };
    }
};
exports.UploadMediaUseCase = UploadMediaUseCase;
exports.UploadMediaUseCase = UploadMediaUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [media_asset_repository_1.MediaAssetRepository,
        media_storage_repository_1.MediaStorageRepository])
], UploadMediaUseCase);
function sanitizeFileName(fileName) {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120);
}
//# sourceMappingURL=upload-media.use-case.js.map