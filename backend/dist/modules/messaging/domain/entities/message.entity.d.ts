import { Entity } from '@shared/domain/entity.base';
export type MessageType = 'TEXT' | 'SYSTEM' | 'MEDIA' | 'GAME_INVITE';
export type SystemMessageEvent = 'PARTICIPANT_JOINED' | 'PARTICIPANT_LEFT' | 'PARTICIPANT_REMOVED' | 'GROUP_CREATED' | 'GROUP_RENAMED' | 'GROUP_AVATAR_CHANGED' | 'ADMIN_PROMOTED' | 'ADMIN_DEMOTED';
export declare const MESSAGE_EDIT_WINDOW_MINUTES = 15;
export interface MessageProps {
    conversationId: string;
    senderId: string | null;
    type: MessageType;
    systemEvent?: SystemMessageEvent | null;
    content: string | null;
    mediaAssetId?: string | null;
    gameSessionId?: string | null;
    editedAt?: Date | null;
    deletedForEveryoneAt?: Date | null;
    deletedForUserIds: Set<string>;
    createdAt: Date;
}
export declare class Message extends Entity<MessageProps> {
    private constructor();
    static createText(params: {
        conversationId: string;
        senderId: string;
        content: string;
    }, id: string): Message;
    static createMedia(params: {
        conversationId: string;
        senderId: string;
        mediaAssetId: string;
        caption?: string | null;
    }, id: string): Message;
    static createGameInvite(params: {
        conversationId: string;
        senderId: string;
        gameSessionId: string;
        content: string;
    }, id: string): Message;
    static createSystem(params: {
        conversationId: string;
        event: SystemMessageEvent;
        content: string;
    }, id: string): Message;
    static restore(props: MessageProps, id: string): Message;
    get conversationId(): string;
    get senderId(): string | null;
    get type(): MessageType;
    get content(): string | null;
    get mediaAssetId(): string | null;
    get gameSessionId(): string | null;
    get createdAt(): Date;
    get editedAt(): Date | null | undefined;
    get isDeletedForEveryone(): boolean;
    isDeletedFor(userId: string): boolean;
    edit(requesterId: string, newContent: string): void;
    deleteForMe(userId: string): void;
    deleteForEveryone(requesterId: string): void;
    toPersistence(): {
        conversationId: string;
        senderId: string | null;
        type: MessageType;
        systemEvent?: SystemMessageEvent | null;
        content: string | null;
        mediaAssetId?: string | null;
        gameSessionId?: string | null;
        editedAt?: Date | null;
        deletedForEveryoneAt?: Date | null;
        deletedForUserIds: Set<string>;
        createdAt: Date;
        id: string;
    };
}
