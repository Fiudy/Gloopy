import { Entity } from '@shared/domain/entity.base';
import { Participant } from './participant';
export type ConversationType = 'DIRECT' | 'GROUP';
export declare const MAX_GROUP_PARTICIPANTS = 1024;
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
export declare class Conversation extends Entity<ConversationProps> {
    private constructor();
    static createDirect(params: {
        initiatorId: string;
        recipientId: string;
    }, id: string): Conversation;
    static createGroup(params: {
        creatorId: string;
        name: string;
        memberIds: string[];
    }, id: string): Conversation;
    static restore(props: ConversationProps, id: string): Conversation;
    get type(): ConversationType;
    get name(): string | null;
    get avatarUrl(): string | null;
    get initiatorId(): string | null;
    get isDirectPending(): boolean;
    get activeParticipants(): Participant[];
    findParticipant(userId: string): Participant | undefined;
    isActiveMember(userId: string): boolean;
    acceptDirect(): void;
    private assertIsGroup;
    private assertIsActiveAdmin;
    private countActiveAdmins;
    addParticipant(requesterId: string, newUserId: string): void;
    removeParticipant(requesterId: string, targetUserId: string): void;
    leave(userId: string): void;
    promoteToAdmin(requesterId: string, targetUserId: string): void;
    demoteAdmin(requesterId: string, targetUserId: string): void;
    rename(requesterId: string, newName: string): void;
    changeAvatar(requesterId: string, avatarUrl: string): void;
    toPersistence(): {
        type: ConversationType;
        name: string | null;
        avatarUrl: string | null;
        initiatorId: string | null;
        acceptedAt: Date | null;
        participants: Participant[];
        createdAt: Date;
        updatedAt: Date;
        id: string;
    };
}
