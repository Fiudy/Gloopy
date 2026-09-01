import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(userId: string, input: UpdateProfileDto) {
    const user = await this.users.findById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    user.updateProfile(input);
    await this.users.save(user);
    return { id: user.id, name: user.name, email: user.email.toString(), avatarUrl: user.avatarUrl ?? null, showLastSeen: user.showLastSeen, readReceiptsEnabled: user.readReceiptsEnabled };
  }
}
