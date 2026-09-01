import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class SearchUsersUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(requesterId: string, query: string, limit: number) {
    const users = await this.users.search(query.trim(), requesterId, limit);
    return users.map((user) => ({ id: user.id, name: user.name, avatarUrl: user.avatarUrl ?? null }));
  }
}
