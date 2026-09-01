import { DomainError } from '@shared/domain/domain-error';

const MAX_LENGTH = 4096;

/**
 * Garante que o conteúdo de uma mensagem de texto nunca fica vazio
 * nem excede o tamanho máximo permitido.
 */
export class MessageContent {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): MessageContent {
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      throw new DomainError('A mensagem não pode ser vazia.');
    }
    if (trimmed.length > MAX_LENGTH) {
      throw new DomainError(`A mensagem excede o limite de ${MAX_LENGTH} caracteres.`);
    }
    return new MessageContent(trimmed);
  }

  toString(): string {
    return this.value;
  }
}
