export type User = { id: string; name: string; email: string; avatarUrl?: string | null; readReceiptsEnabled?: boolean; showLastSeen?: boolean };
export type AuthResponse = { accessToken: string; user: User };
export type Participant = { userId: string; role: 'ADMIN' | 'MEMBER' };
export type Conversation = { id: string; type: 'DIRECT' | 'GROUP'; name: string | null; avatarUrl: string | null; isPending: boolean; participants: Participant[]; lastMessage?: Message | null; unreadCount?: number };
export type MediaInfo = { id: string; kind: string; mimeType: string; sizeBytes: number; fileName: string; url: string };
export type Message = { id: string; conversationId: string; senderId: string | null; type: 'TEXT' | 'MEDIA' | 'SYSTEM' | 'GAME_INVITE'; content: string | null; media: MediaInfo | null; gameSessionId: string | null; editedAt: string | null; createdAt: string; readAt?: string | null };
export type GameSession = { id: string; conversationId: string; status: 'PENDING' | 'IN_PROGRESS' | 'DECLINED' | 'FINISHED'; playerXId: string; playerOId: string; currentTurnUserId: string | null; winnerUserId: string | null; board: string };
export type UserSearchResult = Pick<User, 'id' | 'name' | 'avatarUrl'>;
