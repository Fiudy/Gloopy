import { UserRepository } from '../../domain/repositories/user.repository';
export declare class SearchUsersUseCase {
    private readonly users;
    constructor(users: UserRepository);
    execute(requesterId: string, query: string, limit: number): Promise<{
        id: string;
        name: string;
        avatarUrl: string | null;
    }[]>;
}
