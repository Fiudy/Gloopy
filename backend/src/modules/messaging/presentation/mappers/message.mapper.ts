import { Message } from '../../domain/entities/message.entity';

export interface MessageMediaInfo {
  id: string;
  kind: string;
  mimeType: string;
  sizeBytes: number;
  fileName: string;
  url: string;
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string | null;
  type: string;
  content: string | null;
  media: MessageMediaInfo | null;
  gameSessionId: string | null;
  editedAt: string | null;
  createdAt: string;
}

/**
 * Nunca expõe o conteúdo de uma mensagem apagada para quem a apagou.
 * `mediaInfo` é opcional: quem chama resolve a URL assinada (fora do domínio)
 * e passa pronta aqui - o mapper só monta a resposta. Mensagens GAME_INVITE só
 * trazem o `gameSessionId` - o estado ao vivo da partida é buscado à parte via
 * `GET /games/:sessionId` (evita o Messaging depender do Games e vice-versa).
 */
export function toMessageResponse(
  message: Message,
  viewerId: string,
  mediaInfo?: MessageMediaInfo | null,
): MessageResponse {
  const isDeleted = message.isDeletedFor(viewerId);
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    type: message.type,
    content: isDeleted ? null : message.content,
    media: isDeleted ? null : mediaInfo ?? null,
    gameSessionId: isDeleted ? null : message.gameSessionId,
    editedAt: message.editedAt ? message.editedAt.toISOString() : null,
    createdAt: message.createdAt.toISOString(),
  };
}
