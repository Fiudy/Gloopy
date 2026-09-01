import { DomainError } from '@shared/domain/domain-error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Value Object - garante que um e-mail só existe em memória se for válido.
 * Imutável por natureza (VOs não têm identidade, só valor).
 */
export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Email {
    const normalized = raw.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalized)) {
      throw new DomainError('E-mail inválido.');
    }
    return new Email(normalized);
  }

  toString(): string {
    return this.value;
  }
}
