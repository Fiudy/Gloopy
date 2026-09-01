import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';

const SALT_ROUNDS = 12;

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

/**
 * Caso de uso: registrar um novo usuário.
 * Orquestra o domínio (Email VO, entidade User) e a porta de persistência,
 * sem conhecer HTTP, Nest ou Prisma diretamente.
 */
@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const email = Email.create(input.email);

    const alreadyExists = await this.userRepository.existsByEmail(email.toString());
    if (alreadyExists) {
      throw new ConflictException('Já existe uma conta com este e-mail.');
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = User.create(
      {
        name: input.name,
        email,
        passwordHash,
      },
      uuid(),
    );

    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email.toString(),
    };
  }
}
