import { Entity } from '@shared/domain/entity.base';
import { Email } from '../value-objects/email.vo';
import { DomainError } from '@shared/domain/domain-error';

export interface UserProps {
  name: string;
  email: Email;
  passwordHash: string;
  avatarUrl?: string | null;
  showLastSeen: boolean;
  readReceiptsEnabled: boolean;
  lastSeenAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id: string) {
    super(props, id);
  }

  static create(
    props: {
      name: string;
      email: Email;
      passwordHash: string;
      avatarUrl?: string | null;
    },
    id: string,
  ): User {
    const now = new Date();
    return new User(
      {
        name: props.name,
        email: props.email,
        passwordHash: props.passwordHash,
        avatarUrl: props.avatarUrl ?? null,
        showLastSeen: true,
        readReceiptsEnabled: true,
        lastSeenAt: null,
        createdAt: now,
        updatedAt: now,
      },
      id,
    );
  }

  /** Reidrata uma entidade a partir de dados já persistidos (ex: vindos do Prisma). */
  static restore(props: UserProps, id: string): User {
    return new User(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get avatarUrl(): string | null | undefined {
    return this.props.avatarUrl;
  }

  get showLastSeen(): boolean {
    return this.props.showLastSeen;
  }

  get readReceiptsEnabled(): boolean {
    return this.props.readReceiptsEnabled;
  }

  get lastSeenAt(): Date | null | undefined {
    return this.props.lastSeenAt;
  }

  touchLastSeen(): void {
    this.props.lastSeenAt = new Date();
    this.props.updatedAt = new Date();
  }

  updateProfile(params: { name?: string; showLastSeen?: boolean; readReceiptsEnabled?: boolean }): void {
    if (params.name !== undefined) {
      const name = params.name.trim();
      if (name.length < 2) throw new DomainError('O nome precisa ter pelo menos 2 caracteres.');
      this.props.name = name;
    }
    if (params.showLastSeen !== undefined) this.props.showLastSeen = params.showLastSeen;
    if (params.readReceiptsEnabled !== undefined) this.props.readReceiptsEnabled = params.readReceiptsEnabled;
    this.props.updatedAt = new Date();
  }

  setReadReceiptsEnabled(enabled: boolean): void {
    this.props.readReceiptsEnabled = enabled;
    this.props.updatedAt = new Date();
  }

  setShowLastSeen(show: boolean): void {
    this.props.showLastSeen = show;
    this.props.updatedAt = new Date();
  }

  toPersistence(): UserProps & { id: string } {
    return { id: this.id, ...this.props };
  }
}
