import { Injectable } from '@nestjs/common';
import { PresenceRepository } from '../domain/repositories/presence.repository';
import { UserRepository } from '@modules/identity/domain/repositories/user.repository';

/**
 * Orquestra presença + a marcação de "visto por último" no perfil do usuário
 * (que vive no contexto de Identity - por isso dependemos da porta UserRepository,
 * não de detalhes internos do módulo Identity).
 */
@Injectable()
export class PresenceService {
  constructor(
    private readonly presenceRepository: PresenceRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async connect(userId: string, socketId: string): Promise<{ wasOffline: boolean }> {
    return this.presenceRepository.addConnection(userId, socketId);
  }

  async disconnect(userId: string, socketId: string): Promise<{ isNowOffline: boolean }> {
    const result = await this.presenceRepository.removeConnection(userId, socketId);
    if (result.isNowOffline) {
      const user = await this.userRepository.findById(userId);
      if (user) {
        user.touchLastSeen();
        await this.userRepository.save(user);
      }
    }
    return result;
  }

  async isOnline(userId: string): Promise<boolean> {
    return this.presenceRepository.isOnline(userId);
  }

  async filterOnline(userIds: string[]): Promise<string[]> {
    return this.presenceRepository.filterOnline(userIds);
  }
}
