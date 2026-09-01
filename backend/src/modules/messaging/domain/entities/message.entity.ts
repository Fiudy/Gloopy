import { Entity } from '@shared/domain/entity.base';
import { DomainError } from '@shared/domain/domain-error';
import { MessageContent } from '../value-objects/message-content.vo';

export type MessageType = 'TEXT' | 'SYSTEM' | 'MEDIA' | 'GAME_INVITE';

export type SystemMessageEvent =
  | 'PARTICIPANT_JOINED'
  | 'PARTICIPANT_LEFT'
  | 'PARTICIPANT_REMOVED'
  | 'GROUP_CREATED'
  | 'GROUP_RENAMED'
  | 'GROUP_AVATAR_CHANGED'
  | 'ADMIN_PROMOTED'
  | 'ADMIN_DEMOTED';

// Janela de edição permitida após o envio (estilo WhatsApp: 15 minutos)
export const MESSAGE_EDIT_WINDOW_MINUTES = 15;

export interface MessageProps {
  conversationId: string;
  senderId: string | null; // null para mensagens de sistema
  type: MessageType;
  systemEvent?: SystemMessageEvent | null;
  content: string | null;
  mediaAssetId?: string | null; // preenchido quando type = MEDIA
  gameSessionId?: string | null; // preenchido quando type = GAME_INVITE
  editedAt?: Date | null;
  deletedForEveryoneAt?: Date | null;
  deletedForUserIds: Set<string>; // "apagar para mim"
  createdAt: Date;
}

export class Message extends Entity<MessageProps> {
  private constructor(props: MessageProps, id: string) {
    super(props, id);
  }

  static createText(
    params: { conversationId: string; senderId: string; content: string },
    id: string,
  ): Message {
    const content = MessageContent.create(params.content);
    return new Message(
      {
        conversationId: params.conversationId,
        senderId: params.senderId,
        type: 'TEXT',
        systemEvent: null,
        content: content.toString(),
        mediaAssetId: null,
        gameSessionId: null,
        editedAt: null,
        deletedForEveryoneAt: null,
        deletedForUserIds: new Set(),
        createdAt: new Date(),
      },
      id,
    );
  }

  /** Mensagem de mídia - `caption` é opcional (legenda), diferente de TEXT onde content é obrigatório. */
  static createMedia(
    params: { conversationId: string; senderId: string; mediaAssetId: string; caption?: string | null },
    id: string,
  ): Message {
    return new Message(
      {
        conversationId: params.conversationId,
        senderId: params.senderId,
        type: 'MEDIA',
        systemEvent: null,
        content: params.caption?.trim() || null,
        mediaAssetId: params.mediaAssetId,
        gameSessionId: null,
        editedAt: null,
        deletedForEveryoneAt: null,
        deletedForUserIds: new Set(),
        createdAt: new Date(),
      },
      id,
    );
  }

  /** Convite de partida - o conteúdo textual é só uma descrição amigável pra quem não suporta o card interativo. */
  static createGameInvite(
    params: { conversationId: string; senderId: string; gameSessionId: string; content: string },
    id: string,
  ): Message {
    return new Message(
      {
        conversationId: params.conversationId,
        senderId: params.senderId,
        type: 'GAME_INVITE',
        systemEvent: null,
        content: params.content,
        mediaAssetId: null,
        gameSessionId: params.gameSessionId,
        editedAt: null,
        deletedForEveryoneAt: null,
        deletedForUserIds: new Set(),
        createdAt: new Date(),
      },
      id,
    );
  }

  static createSystem(
    params: { conversationId: string; event: SystemMessageEvent; content: string },
    id: string,
  ): Message {
    return new Message(
      {
        conversationId: params.conversationId,
        senderId: null,
        type: 'SYSTEM',
        systemEvent: params.event,
        content: params.content,
        mediaAssetId: null,
        gameSessionId: null,
        editedAt: null,
        deletedForEveryoneAt: null,
        deletedForUserIds: new Set(),
        createdAt: new Date(),
      },
      id,
    );
  }

  static restore(props: MessageProps, id: string): Message {
    return new Message(props, id);
  }

  get conversationId(): string {
    return this.props.conversationId;
  }

  get senderId(): string | null {
    return this.props.senderId;
  }

  get type(): MessageType {
    return this.props.type;
  }

  get content(): string | null {
    return this.props.content;
  }

  get mediaAssetId(): string | null {
    return this.props.mediaAssetId ?? null;
  }

  get gameSessionId(): string | null {
    return this.props.gameSessionId ?? null;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get editedAt(): Date | null | undefined {
    return this.props.editedAt;
  }

  get isDeletedForEveryone(): boolean {
    return !!this.props.deletedForEveryoneAt;
  }

  isDeletedFor(userId: string): boolean {
    return this.props.deletedForUserIds.has(userId) || this.isDeletedForEveryone;
  }

  /** Regra: só quem enviou pode editar, e só dentro da janela de tempo permitida. */
  edit(requesterId: string, newContent: string): void {
    if (this.props.type !== 'TEXT') {
      throw new DomainError('Apenas mensagens de texto podem ser editadas.');
    }
    if (this.props.senderId !== requesterId) {
      throw new DomainError('Apenas quem enviou a mensagem pode editá-la.');
    }
    if (this.isDeletedForEveryone) {
      throw new DomainError('Não é possível editar uma mensagem apagada.');
    }

    const minutesSinceSent = (Date.now() - this.props.createdAt.getTime()) / 60000;
    if (minutesSinceSent > MESSAGE_EDIT_WINDOW_MINUTES) {
      throw new DomainError(
        `O prazo para editar esta mensagem (${MESSAGE_EDIT_WINDOW_MINUTES} minutos) expirou.`,
      );
    }

    this.props.content = MessageContent.create(newContent).toString();
    this.props.editedAt = new Date();
  }

  /** "Apagar para mim" - sem prazo, qualquer participante pode aplicar à própria visão. */
  deleteForMe(userId: string): void {
    this.props.deletedForUserIds.add(userId);
  }

  /** "Apagar para todos" - sem prazo, só quem enviou. */
  deleteForEveryone(requesterId: string): void {
    if (this.props.senderId !== requesterId) {
      throw new DomainError('Apenas quem enviou a mensagem pode apagá-la para todos.');
    }
    this.props.deletedForEveryoneAt = new Date();
  }

  toPersistence() {
    return { id: this.id, ...this.props };
  }
}
