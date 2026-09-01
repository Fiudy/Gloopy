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
var MinioMediaStorageRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinioMediaStorageRepository = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const minio_1 = require("minio");
const DEFAULT_PRESIGNED_URL_EXPIRY_SECONDS = 24 * 60 * 60;
let MinioMediaStorageRepository = MinioMediaStorageRepository_1 = class MinioMediaStorageRepository {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(MinioMediaStorageRepository_1.name);
        this.bucket = this.config.get('MINIO_BUCKET', 'gloopy-media');
        this.client = new minio_1.Client({
            endPoint: this.config.get('MINIO_ENDPOINT', 'localhost'),
            port: this.config.get('MINIO_PORT', 9000),
            useSSL: this.config.get('MINIO_USE_SSL', 'false') === 'true',
            accessKey: this.config.get('MINIO_ACCESS_KEY', 'gloopy'),
            secretKey: this.config.get('MINIO_SECRET_KEY', 'gloopy12345'),
        });
    }
    async onModuleInit() {
        try {
            const exists = await this.client.bucketExists(this.bucket);
            if (!exists) {
                await this.client.makeBucket(this.bucket);
                this.logger.log(`Bucket "${this.bucket}" criado no MinIO.`);
            }
        }
        catch (error) {
            this.logger.error(`Falha ao verificar/criar bucket no MinIO: ${error.message}`);
        }
    }
    async upload(params) {
        await this.client.putObject(this.bucket, params.key, params.buffer, params.buffer.length, {
            'Content-Type': params.mimeType,
        });
    }
    async getPresignedUrl(key, expirySeconds = DEFAULT_PRESIGNED_URL_EXPIRY_SECONDS) {
        return this.client.presignedGetObject(this.bucket, key, expirySeconds);
    }
    async delete(key) {
        await this.client.removeObject(this.bucket, key);
    }
};
exports.MinioMediaStorageRepository = MinioMediaStorageRepository;
exports.MinioMediaStorageRepository = MinioMediaStorageRepository = MinioMediaStorageRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MinioMediaStorageRepository);
//# sourceMappingURL=minio-media-storage.repository.js.map