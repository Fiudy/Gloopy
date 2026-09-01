"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaModule = void 0;
const common_1 = require("@nestjs/common");
const media_controller_1 = require("./presentation/media.controller");
const upload_media_use_case_1 = require("./application/use-cases/upload-media.use-case");
const media_asset_repository_1 = require("./domain/repositories/media-asset.repository");
const media_storage_repository_1 = require("./domain/repositories/media-storage.repository");
const prisma_media_asset_repository_1 = require("./infrastructure/persistence/prisma-media-asset.repository");
const minio_media_storage_repository_1 = require("./infrastructure/storage/minio-media-storage.repository");
let MediaModule = class MediaModule {
};
exports.MediaModule = MediaModule;
exports.MediaModule = MediaModule = __decorate([
    (0, common_1.Module)({
        controllers: [media_controller_1.MediaController],
        providers: [
            upload_media_use_case_1.UploadMediaUseCase,
            { provide: media_asset_repository_1.MediaAssetRepository, useClass: prisma_media_asset_repository_1.PrismaMediaAssetRepository },
            { provide: media_storage_repository_1.MediaStorageRepository, useClass: minio_media_storage_repository_1.MinioMediaStorageRepository },
        ],
        exports: [media_asset_repository_1.MediaAssetRepository, media_storage_repository_1.MediaStorageRepository],
    })
], MediaModule);
//# sourceMappingURL=media.module.js.map