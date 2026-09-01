import { PresenceRepository } from '../domain/repositories/presence.repository';
import { UserRepository } from '@modules/identity/domain/repositories/user.repository';
export declare class PresenceService {
    private readonly presenceRepository;
    private readonly userRepository;
    constructor(presenceRepository: PresenceRepository, userRepository: UserRepository);
    connect(userId: string, socketId: string): Promise<{
        wasOffline: boolean;
    }>;
    disconnect(userId: string, socketId: string): Promise<{
        isNowOffline: boolean;
    }>;
    isOnline(userId: string): Promise<boolean>;
    filterOnline(userIds: string[]): Promise<string[]>;
}
