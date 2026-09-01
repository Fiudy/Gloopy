import { IsString, MinLength, MaxLength } from 'class-validator';

export class EditMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4096)
  content!: string;
}
