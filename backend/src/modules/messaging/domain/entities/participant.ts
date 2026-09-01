export type ParticipantRole = 'MEMBER' | 'ADMIN';

/**
 * Participante de uma conversa. Não é uma entidade com ciclo de vida próprio
 * fora do agregado Conversation - vive e morre junto com ele.
 */
export class Participant {
  constructor(
    public readonly userId: string,
    public role: ParticipantRole,
    public readonly joinedAt: Date,
    public leftAt: Date | null,
    public removedByUserId: string | null,
  ) {}

  get isActive(): boolean {
    return this.leftAt === null;
  }

  get isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  static join(userId: string, role: ParticipantRole = 'MEMBER'): Participant {
    return new Participant(userId, role, new Date(), null, null);
  }
}
