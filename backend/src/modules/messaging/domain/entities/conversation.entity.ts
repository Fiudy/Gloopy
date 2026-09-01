import { Entity } from '@shared/domain/entity.base';
import { DomainError } from '@shared/domain/domain-error';
import { Participant } from './participant';

export type ConversationType = 'DIRECT' | 'GROUP';

// Mesmo limite de participantes usado pelo WhatsApp em grupos comuns.
export const MAX_GROUP_PARTICIPANTS = 1024;

export interface ConversationProps {
  type: ConversationType;
  name: string | null;
  avatarUrl: string | null;
  initiatorId: string | null;
  acceptedAt: Date | null;
  participants: Participant[];
  createdAt: Date;
  updatedAt: Date;
}

export class Conversation extends Entity<ConversationProps> {
  private constructor(props: ConversationProps, id: string) {
    super(props, id);
  }

  // ---------- Fábricas ----------

  /**
   * Conversa 1:1 é criada automaticamente no primeiro contato.
   * Fica "pendente" (acceptedAt null) até o destinatário interagir -
   * é isso que permite o front exibir "Fulano quer falar com você".
   */
  static createDirect(params: { initiatorId: string; recipientId: string }, id: string): Conversation {
    if (params.initiatorId === params.recipientId) {
      throw new DomainError('Não é possível iniciar uma conversa consigo mesmo.');
    }

    const now = new Date();
    return new Conversation(
      {
        type: 'DIRECT',
        name: null,
        avatarUrl: null,
        initiatorId: params.initiatorId,
        acceptedAt: null,
        participants: [Participant.join(params.initiatorId), Participant.join(params.recipientId)],
        createdAt: now,
        updatedAt: now,
      },
      id,
    );
  }

  static createGroup(
    params: { creatorId: string; name: string; memberIds: string[] },
    id: string,
  ): Conversation {
    const name = params.name.trim();
    if (name.length === 0) {
      throw new DomainError('O grupo precisa de um nome.');
    }

    const uniqueMemberIds = Array.from(new Set(params.memberIds.filter((m) => m !== params.creatorId)));
    const totalParticipants = uniqueMemberIds.length + 1; // +1 do criador
    if (totalParticipants > MAX_GROUP_PARTICIPANTS) {
      throw new DomainError(`Um grupo pode ter no máximo ${MAX_GROUP_PARTICIPANTS} participantes.`);
    }

    const now = new Date();
    const participants = [
      Participant.join(params.creatorId, 'ADMIN'),
      ...uniqueMemberIds.map((userId) => Participant.join(userId, 'MEMBER')),
    ];

    return new Conversation(
      {
        type: 'GROUP',
        name,
        avatarUrl: null,
        initiatorId: null,
        acceptedAt: null,
        participants,
        createdAt: now,
        updatedAt: now,
      },
      id,
    );
  }

  static restore(props: ConversationProps, id: string): Conversation {
    return new Conversation(props, id);
  }

  // ---------- Getters ----------

  get type(): ConversationType {
    return this.props.type;
  }

  get name(): string | null {
    return this.props.name;
  }

  get avatarUrl(): string | null {
    return this.props.avatarUrl;
  }

  get initiatorId(): string | null {
    return this.props.initiatorId;
  }

  get isDirectPending(): boolean {
    return this.props.type === 'DIRECT' && this.props.acceptedAt === null;
  }

  get activeParticipants(): Participant[] {
    return this.props.participants.filter((p) => p.isActive);
  }

  findParticipant(userId: string): Participant | undefined {
    return this.props.participants.find((p) => p.userId === userId);
  }

  isActiveMember(userId: string): boolean {
    const participant = this.findParticipant(userId);
    return !!participant && participant.isActive;
  }

  // ---------- Regras de negócio ----------

  /** Marca a conversa DIRECT como aceita (destinatário respondeu/abriu a conversa). */
  acceptDirect(): void {
    if (this.props.type !== 'DIRECT') return;
    if (this.props.acceptedAt === null) {
      this.props.acceptedAt = new Date();
    }
  }

  private assertIsGroup(): void {
    if (this.props.type !== 'GROUP') {
      throw new DomainError('Esta operação só é válida para grupos.');
    }
  }

  private assertIsActiveAdmin(userId: string): void {
    const participant = this.findParticipant(userId);
    if (!participant || !participant.isActive || !participant.isAdmin) {
      throw new DomainError('Apenas administradores do grupo podem realizar esta ação.');
    }
  }

  private countActiveAdmins(): number {
    return this.activeParticipants.filter((p) => p.isAdmin).length;
  }

  /** Admin adiciona um novo membro ao grupo. */
  addParticipant(requesterId: string, newUserId: string): void {
    this.assertIsGroup();
    this.assertIsActiveAdmin(requesterId);

    if (this.isActiveMember(newUserId)) {
      throw new DomainError('Este usuário já faz parte do grupo.');
    }
    if (this.activeParticipants.length + 1 > MAX_GROUP_PARTICIPANTS) {
      throw new DomainError(`Um grupo pode ter no máximo ${MAX_GROUP_PARTICIPANTS} participantes.`);
    }

    const existing = this.findParticipant(newUserId);
    if (existing) {
      // Já foi participante antes (saiu ou foi removido) - reingressa.
      existing.leftAt = null;
      existing.removedByUserId = null;
      existing.role = 'MEMBER';
    } else {
      this.props.participants.push(Participant.join(newUserId));
    }
    this.props.updatedAt = new Date();
  }

  /** Admin remove um membro do grupo. */
  removeParticipant(requesterId: string, targetUserId: string): void {
    this.assertIsGroup();
    this.assertIsActiveAdmin(requesterId);

    if (requesterId === targetUserId) {
      throw new DomainError('Para sair do grupo, use a ação de sair - não a de remover.');
    }

    const target = this.findParticipant(targetUserId);
    if (!target || !target.isActive) {
      throw new DomainError('Este usuário não faz parte do grupo.');
    }
    if (target.isAdmin && this.countActiveAdmins() <= 1) {
      throw new DomainError('Não é possível remover o único administrador restante do grupo.');
    }

    target.leftAt = new Date();
    target.removedByUserId = requesterId;
    this.props.updatedAt = new Date();
  }

  /** O próprio usuário sai do grupo. Se era o último admin, promove automaticamente o membro mais antigo. */
  leave(userId: string): void {
    this.assertIsGroup();
    const participant = this.findParticipant(userId);
    if (!participant || !participant.isActive) {
      throw new DomainError('Você não faz parte deste grupo.');
    }

    const wasLastAdmin = participant.isAdmin && this.countActiveAdmins() <= 1;
    participant.leftAt = new Date();
    participant.removedByUserId = null;

    if (wasLastAdmin) {
      const nextInLine = this.activeParticipants.sort(
        (a, b) => a.joinedAt.getTime() - b.joinedAt.getTime(),
      )[0];
      if (nextInLine) {
        nextInLine.role = 'ADMIN';
      }
    }

    this.props.updatedAt = new Date();
  }

  promoteToAdmin(requesterId: string, targetUserId: string): void {
    this.assertIsGroup();
    this.assertIsActiveAdmin(requesterId);

    const target = this.findParticipant(targetUserId);
    if (!target || !target.isActive) {
      throw new DomainError('Este usuário não faz parte do grupo.');
    }
    target.role = 'ADMIN';
    this.props.updatedAt = new Date();
  }

  demoteAdmin(requesterId: string, targetUserId: string): void {
    this.assertIsGroup();
    this.assertIsActiveAdmin(requesterId);

    const target = this.findParticipant(targetUserId);
    if (!target || !target.isActive || !target.isAdmin) {
      throw new DomainError('Este usuário não é administrador do grupo.');
    }
    if (this.countActiveAdmins() <= 1) {
      throw new DomainError('O grupo precisa de pelo menos um administrador.');
    }
    target.role = 'MEMBER';
    this.props.updatedAt = new Date();
  }

  rename(requesterId: string, newName: string): void {
    this.assertIsGroup();
    this.assertIsActiveAdmin(requesterId);

    const trimmed = newName.trim();
    if (trimmed.length === 0) {
      throw new DomainError('O nome do grupo não pode ser vazio.');
    }
    this.props.name = trimmed;
    this.props.updatedAt = new Date();
  }

  changeAvatar(requesterId: string, avatarUrl: string): void {
    this.assertIsGroup();
    this.assertIsActiveAdmin(requesterId);
    this.props.avatarUrl = avatarUrl;
    this.props.updatedAt = new Date();
  }

  toPersistence() {
    return { id: this.id, ...this.props };
  }
}
