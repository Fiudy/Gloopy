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
exports.PrismaMediaAssetRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/infrastructure/prisma/prisma.service");
const media_asset_entity_1 = require("../../domain/entities/media-asset.entity");
let PrismaMediaAssetRepository = class PrismaMediaAssetRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const record = await this.prisma.mediaAsset.findUnique({ where: { id } });
        return record ? this.toDomain(record) : null;
    }
    async save(asset) {
        const data = asset.toPersistence();
        await this.prisma.mediaAsset.upsert({
            where: { id: data.id },
            create: {
                id: data.id,
                uploaderId: data.uploaderId,
                kind: data.kind,
                mimeType: data.mimeType,
                sizeBytes: data.sizeBytes,
                fileName: data.fileName,
                storageKey: data.storageKey,
                createdAt: data.createdAt,
            },
            update: {},
        });
    }
    toDomain(record) {
        const props = {
            uploaderId: record.uploaderId,
            kind: record.kind,
            mimeType: record.mimeType,
            sizeBytes: record.sizeBytes,
            fileName: record.fileName,
            storageKey: record.storageKey,
            createdAt: record.createdAt,
        };
        return media_asset_entity_1.MediaAsset.restore(props, record.id);
    }
};
exports.PrismaMediaAssetRepository = PrismaMediaAssetRepository;
exports.PrismaMediaAssetRepository = PrismaMediaAssetRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaMediaAssetRepository);
//# sourceMappingURL=prisma-media-asset.repository.js.map