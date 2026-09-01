import { IsIn } from 'class-validator';
import { InviteResponse } from '../use-cases/respond-to-invite.use-case';

export class RespondToInviteDto {
  @IsIn(['ACCEPT', 'DECLINE'])
  response!: InviteResponse;
}
