/**
 * Erro de regra de negócio (violação de invariante do domínio).
 * A camada de apresentação (controllers/gateways) mapeia isso para
 * o código HTTP/WS apropriado - o domínio não conhece HTTP.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}
