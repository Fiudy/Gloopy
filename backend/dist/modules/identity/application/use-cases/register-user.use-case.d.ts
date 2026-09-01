import { UserRepository } from '../../domain/repositories/user.repository';
export interface RegisterUserInput {
    name: string;
    email: string;
    password: string;
}
export interface RegisterUserOutput {
    id: string;
    name: string;
    email: string;
}
export declare class RegisterUserUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(input: RegisterUserInput): Promise<RegisterUserOutput>;
}
