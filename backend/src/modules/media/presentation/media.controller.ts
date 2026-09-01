import { Controller, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { memoryStorage } from 'multer';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UploadMediaUseCase } from '../application/use-cases/upload-media.use-case';
import { MAX_FILE_SIZE_BYTES } from '../domain/value-objects/media-file.vo';

@UseGuards(AuthGuard('jwt'))
@Controller('media')
export class MediaController {
  constructor(private readonly uploadMedia: UploadMediaUseCase) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
    }),
  )
  async upload(
    @CurrentUser() userId: string,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: true })) file: Express.Multer.File,
  ) {
    return this.uploadMedia.execute({
      uploaderId: userId,
      fileName: file.originalname,
      mimeType: file.mimetype,
      buffer: file.buffer,
    });
  }
}
