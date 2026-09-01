import { IsIn, IsOptional } from 'class-validator';
import { DeleteScope } from '../use-cases/delete-message.use-case';

export class DeleteMessageQueryDto {
  @IsOptional()
  @IsIn(['ME', 'EVERYONE'])
  scope: DeleteScope = 'ME';
}
