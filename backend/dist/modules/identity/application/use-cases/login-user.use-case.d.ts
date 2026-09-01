import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../domain/repositories/user.repository';
export interface LoginUserInput {
    email: string;
    password: string;
}
export interface LoginUserOutput {
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}
export declare class LoginUserUseCase {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: UserRepository, jwtService: JwtService);
    execute(input: LoginUserInput): Promise<LoginUserOutput>;
}
