import { IsUUID } from 'class-validator';

export class InviteToGameDto {
  @IsUUID()
  opponentId!: string;
}
