import { User } from '../entities/user.entity';
export declare abstract class UserRepository {
    abstract findById(id: string): Promise<User | null>;
    abstract findByEmail(email: string): Promise<User | null>;
    abstract save(user: User): Promise<void>;
    abstract existsByEmail(email: string): Promise<boolean>;
    abstract search(query: string, excludeUserId: string, limit: number): Promise<User[]>;
}
