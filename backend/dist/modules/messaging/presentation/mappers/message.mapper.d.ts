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
export declare function toMessageResponse(message: Message, viewerId: string, mediaInfo?: MessageMediaInfo | null): MessageResponse;
