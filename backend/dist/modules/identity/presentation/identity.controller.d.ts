import { RegisterUserDto } from '../application/dto/register-user.dto';
import { LoginUserDto } from '../application/dto/login-user.dto';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../application/use-cases/login-user.use-case';
import { GetProfileUseCase } from '../application/use-cases/get-profile.use-case';
import { UpdateProfileUseCase } from '../application/use-cases/update-profile.use-case';
import { SearchUsersUseCase } from '../application/use-cases/search-users.use-case';
import { UpdateProfileDto } from '../application/dto/update-profile.dto';
import { SearchUsersDto } from '../application/dto/search-users.dto';
export declare class IdentityController {
    private readonly registerUserUseCase;
    private readonly loginUserUseCase;
    private readonly getProfile;
    private readonly updateProfile;
    private readonly searchUsers;
    constructor(registerUserUseCase: RegisterUserUseCase, loginUserUseCase: LoginUserUseCase, getProfile: GetProfileUseCase, updateProfile: UpdateProfileUseCase, searchUsers: SearchUsersUseCase);
    register(dto: RegisterUserDto): Promise<import("../application/use-cases/register-user.use-case").RegisterUserOutput>;
    login(dto: LoginUserDto): Promise<import("../application/use-cases/login-user.use-case").LoginUserOutput>;
    me(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
        showLastSeen: boolean;
        readReceiptsEnabled: boolean;
        lastSeenAt: string | null;
    }>;
    updateMe(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
        showLastSeen: boolean;
        readReceiptsEnabled: boolean;
    }>;
    findUsers(userId: string, query: SearchUsersDto): Promise<{
        id: string;
        name: string;
        avatarUrl: string | null;
    }[]>;
}
