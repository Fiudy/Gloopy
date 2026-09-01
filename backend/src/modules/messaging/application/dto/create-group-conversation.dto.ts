import { ArrayMinSize, IsArray, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateGroupConversationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Um grupo precisa de pelo menos mais um participante além de você.' })
  @IsUUID('4', { each: true })
  memberIds!: string[];
}
