import Redis from 'ioredis';
import { PresenceRepository } from '../domain/repositories/presence.repository';
export declare class RedisPresenceRepository implements PresenceRepository {
    private readonly redis;
    constructor(redis: Redis);
    addConnection(userId: string, socketId: string): Promise<{
        wasOffline: boolean;
    }>;
    removeConnection(userId: string, socketId: string): Promise<{
        isNowOffline: boolean;
    }>;
    isOnline(userId: string): Promise<boolean>;
    filterOnline(userIds: string[]): Promise<string[]>;
}
