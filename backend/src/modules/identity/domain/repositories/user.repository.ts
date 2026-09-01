import { User } from '../entities/user.entity';

/**
 * Porta (interface) do repositório de usuários.
 * O domínio/aplicação dependem só disso - quem implementa é a infraestrutura (Prisma).
 */
export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract save(user: User): Promise<void>;
  abstract existsByEmail(email: string): Promise<boolean>;
  abstract search(query: string, excludeUserId: string, limit: number): Promise<User[]>;
}
