import { UserRepository } from '../../domain/repositories/user.repository';
export declare class GetProfileUseCase {
    private readonly users;
    constructor(users: UserRepository);
    execute(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
        showLastSeen: boolean;
        readReceiptsEnabled: boolean;
        lastSeenAt: string | null;
    }>;
}
