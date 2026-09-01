import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class GetProfileUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return {
      id: user.id,
      name: user.name,
      email: user.email.toString(),
      avatarUrl: user.avatarUrl ?? null,
      showLastSeen: user.showLastSeen,
      readReceiptsEnabled: user.readReceiptsEnabled,
      lastSeenAt: user.showLastSeen ? user.lastSeenAt?.toISOString() ?? null : null,
    };
  }
}
