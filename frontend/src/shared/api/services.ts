import { api } from './client';
import type { AuthResponse, Conversation, GameSession, MediaInfo, Message, User, UserSearchResult } from './types';

export const authApi = {
  login: async (body: { email: string; password: string }) => (await api.post<AuthResponse>('/auth/login', body)).data,
  register: async (body: { name: string; email: string; password: string }) => (await api.post<User>('/auth/register', body)).data,
  me: async () => (await api.get<User>('/auth/me')).data,
  update: async (body: Partial<Pick<User, 'name' | 'showLastSeen' | 'readReceiptsEnabled'>>) => (await api.patch<User>('/auth/me', body)).data,
  searchUsers: async (query: string) => (await api.get<UserSearchResult[]>('/auth/users/search', { params: { q: query, limit: 20 } })).data,
};
export const conversationsApi = {
  list: async () => (await api.get<Conversation[]>('/conversations')).data,
  createDirect: async (recipientId: string) => (await api.post<Conversation>('/conversations/direct', { recipientId })).data,
  createGroup: async (name: string, memberIds: string[]) => (await api.post<Conversation>('/conversations/group', { name, memberIds })).data,
  messages: async (id: string) => (await api.get<Message[]>(`/conversations/${id}/messages`, { params: { limit: 50 } })).data,
  send: async (id: string, content: string) => (await api.post<Message>(`/conversations/${id}/messages`, { content })).data,
  edit: async (id: string, content: string) => (await api.patch<Message>(`/messages/${id}`, { content })).data,
  remove: async (id: string, scope: 'ME' | 'EVERYONE') => api.delete(`/messages/${id}`, { params: { scope } }),
  read: async (id: string) => api.post(`/messages/${id}/read`),
  addParticipant: async (conversationId: string, userId: string) => api.post(`/conversations/${conversationId}/participants/${userId}`),
  removeParticipant: async (conversationId: string, userId: string) => api.delete(`/conversations/${conversationId}/participants/${userId}`),
  promote: async (conversationId: string, userId: string) => api.post(`/conversations/${conversationId}/participants/${userId}/promote`),
  demote: async (conversationId: string, userId: string) => api.post(`/conversations/${conversationId}/participants/${userId}/demote`),
  leave: async (conversationId: string) => api.post(`/conversations/${conversationId}/leave`),
  rename: async (conversationId: string, name: string) => (await api.patch<Conversation>(`/conversations/${conversationId}`, { name })).data,
};
export const mediaApi = {
  upload: async (file: File) => { const form = new FormData(); form.append('file', file); return (await api.post<MediaInfo>('/media', form)).data; },
  send: async (conversationId: string, mediaAssetId: string, caption?: string) => (await api.post<Message>(`/conversations/${conversationId}/media-messages`, { mediaAssetId, caption })).data,
};
export const gamesApi = {
  get: async (id: string) => (await api.get<GameSession>(`/games/${id}`)).data,
  invite: async (conversationId: string, opponentId: string) => (await api.post(`/conversations/${conversationId}/game-invites`, { opponentId })).data,
  respond: async (id: string, response: 'ACCEPT' | 'DECLINE') => (await api.post<GameSession>(`/games/${id}/respond`, { response })).data,
  move: async (id: string, cellIndex: number) => (await api.post<GameSession>(`/games/${id}/moves`, { cellIndex })).data,
};
