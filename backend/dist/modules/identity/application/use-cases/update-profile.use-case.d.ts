import { UserRepository } from '../../domain/repositories/user.repository';
import { UpdateProfileDto } from '../dto/update-profile.dto';
export declare class UpdateProfileUseCase {
    private readonly users;
    constructor(users: UserRepository);
    execute(userId: string, input: UpdateProfileDto): Promise<{
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
        showLastSeen: boolean;
        readReceiptsEnabled: boolean;
    }>;
}
