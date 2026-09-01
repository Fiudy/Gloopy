import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class SendMediaMessageDto {
  @IsUUID()
  mediaAssetId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  caption?: string;
}
