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
exports.MessageMediaEnricherService = void 0;
const common_1 = require("@nestjs/common");
const media_asset_repository_1 = require("../../../media/domain/repositories/media-asset.repository");
const media_storage_repository_1 = require("../../../media/domain/repositories/media-storage.repository");
let MessageMediaEnricherService = class MessageMediaEnricherService {
    constructor(mediaAssetRepository, mediaStorageRepository) {
        this.mediaAssetRepository = mediaAssetRepository;
        this.mediaStorageRepository = mediaStorageRepository;
    }
    async resolveFor(messages) {
        const mediaMessages = messages.filter((m) => m.type === 'MEDIA' && m.mediaAssetId);
        const entries = await Promise.all(mediaMessages.map(async (message) => {
            const asset = await this.mediaAssetRepository.findById(message.mediaAssetId);
            if (!asset)
                return null;
            const url = await this.mediaStorageRepository.getPresignedUrl(asset.storageKey);
            const info = {
                id: asset.id,
                kind: asset.kind,
                mimeType: asset.mimeType,
                sizeBytes: asset.sizeBytes,
                fileName: asset.fileName,
                url,
            };
            return [message.id, info];
        }));
        return new Map(entries.filter((e) => e !== null));
    }
};
exports.MessageMediaEnricherService = MessageMediaEnricherService;
exports.MessageMediaEnricherService = MessageMediaEnricherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [media_asset_repository_1.MediaAssetRepository,
        media_storage_repository_1.MediaStorageRepository])
], MessageMediaEnricherService);
//# sourceMappingURL=message-media-enricher.service.js.map