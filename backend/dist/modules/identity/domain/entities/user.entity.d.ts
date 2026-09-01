import { Entity } from '@shared/domain/entity.base';
import { Email } from '../value-objects/email.vo';
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
export declare class User extends Entity<UserProps> {
    private constructor();
    static create(props: {
        name: string;
        email: Email;
        passwordHash: string;
        avatarUrl?: string | null;
    }, id: string): User;
    static restore(props: UserProps, id: string): User;
    get name(): string;
    get email(): Email;
    get passwordHash(): string;
    get avatarUrl(): string | null | undefined;
    get showLastSeen(): boolean;
    get readReceiptsEnabled(): boolean;
    get lastSeenAt(): Date | null | undefined;
    touchLastSeen(): void;
    updateProfile(params: {
        name?: string;
        showLastSeen?: boolean;
        readReceiptsEnabled?: boolean;
    }): void;
    setReadReceiptsEnabled(enabled: boolean): void;
    setShowLastSeen(show: boolean): void;
    toPersistence(): UserProps & {
        id: string;
    };
}
