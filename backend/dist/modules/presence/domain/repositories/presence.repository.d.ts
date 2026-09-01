export declare abstract class PresenceRepository {
    abstract addConnection(userId: string, socketId: string): Promise<{
        wasOffline: boolean;
    }>;
    abstract removeConnection(userId: string, socketId: string): Promise<{
        isNowOffline: boolean;
    }>;
    abstract isOnline(userId: string): Promise<boolean>;
    abstract filterOnline(userIds: string[]): Promise<string[]>;
}
