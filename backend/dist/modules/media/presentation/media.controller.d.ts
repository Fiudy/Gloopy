import { UploadMediaUseCase } from '../application/use-cases/upload-media.use-case';
export declare class MediaController {
    private readonly uploadMedia;
    constructor(uploadMedia: UploadMediaUseCase);
    upload(userId: string, file: Express.Multer.File): Promise<import("../application/use-cases/upload-media.use-case").UploadMediaOutput>;
}
