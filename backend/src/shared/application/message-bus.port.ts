/**
 * Porta de barramento de eventos entre bounded contexts e a camada de tempo real.
 * Um caso de uso publica um evento; quem consome (o RealtimeGateway, hoje) nem
 * precisa estar no mesmo processo - é isso que permite escalar a API
 * horizontalmente (múltiplas instâncias atrás de um load balancer).
 */
export interface BusEvent<T = unknown> {
  type: string;
  data: T;
}

export abstract class MessageBusPublisher {
  /** Publica um evento endereçado a um usuário específico (routing key `user.{userId}`). */
  abstract publishToUser(userId: string, event: BusEvent): Promise<void>;

  /** Publica um evento endereçado a uma sala de conversa (routing key `conversation.{id}`). */
  abstract publishToConversation(conversationId: string, event: BusEvent): Promise<void>;
}
