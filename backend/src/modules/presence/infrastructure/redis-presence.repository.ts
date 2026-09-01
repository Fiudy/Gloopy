import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { PresenceRepository } from '../domain/repositories/presence.repository';
import { REDIS_CLIENT } from './redis.provider';

const key = (userId: string) => `presence:connections:${userId}`;

/**
 * Um usuário online é representado por um SET no Redis com os socketIds
 * ativos. Suporta múltiplos dispositivos: só fica "offline" quando o set esvazia.
 */
@Injectable()
export class RedisPresenceRepository implements PresenceRepository {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async addConnection(userId: string, socketId: string): Promise<{ wasOffline: boolean }> {
    const countBefore = await this.redis.scard(key(userId));
    await this.redis.sadd(key(userId), socketId);
    return { wasOffline: countBefore === 0 };
  }

  async removeConnection(userId: string, socketId: string): Promise<{ isNowOffline: boolean }> {
    await this.redis.srem(key(userId), socketId);
    const countAfter = await this.redis.scard(key(userId));
    return { isNowOffline: countAfter === 0 };
  }

  async isOnline(userId: string): Promise<boolean> {
    const count = await this.redis.scard(key(userId));
    return count > 0;
  }

  async filterOnline(userIds: string[]): Promise<string[]> {
    if (userIds.length === 0) return [];
    const pipeline = this.redis.pipeline();
    userIds.forEach((id) => pipeline.scard(key(id)));
    const results = await pipeline.exec();
    return userIds.filter((_, index) => Number(results?.[index]?.[1] ?? 0) > 0);
  }
}
