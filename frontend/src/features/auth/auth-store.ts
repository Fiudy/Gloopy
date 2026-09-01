import { create } from 'zustand';
import { authToken } from '../../shared/api/client';
import { disconnectSocket } from '../../shared/api/socket';
import type { User } from '../../shared/api/types';
type AuthState = { user: User | null; isAuthenticated: boolean; signIn: (user: User, token: string) => void; updateUser: (user: User) => void; signOut: () => void };
const USER_KEY = 'gloopy_user';
function storedUser(): User | null { try { const value = localStorage.getItem(USER_KEY); return value ? JSON.parse(value) as User : null; } catch { return null; } }
export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser(), isAuthenticated: Boolean(authToken.get()),
  signIn: (user, token) => { authToken.set(token); localStorage.setItem(USER_KEY, JSON.stringify(user)); set({ user, isAuthenticated: true }); },
  updateUser: (user) => { localStorage.setItem(USER_KEY, JSON.stringify(user)); set({ user }); },
  signOut: () => { authToken.clear(); localStorage.removeItem(USER_KEY); disconnectSocket(); set({ user: null, isAuthenticated: false }); },
}));
