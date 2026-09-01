export type ParticipantRole = 'MEMBER' | 'ADMIN';
export declare class Participant {
    readonly userId: string;
    role: ParticipantRole;
    readonly joinedAt: Date;
    leftAt: Date | null;
    removedByUserId: string | null;
    constructor(userId: string, role: ParticipantRole, joinedAt: Date, leftAt: Date | null, removedByUserId: string | null);
    get isActive(): boolean;
    get isAdmin(): boolean;
    static join(userId: string, role?: ParticipantRole): Participant;
}
