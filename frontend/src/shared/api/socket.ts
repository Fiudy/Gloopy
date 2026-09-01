import { io, type Socket } from 'socket.io-client';
import { authToken } from './client';
let socket: Socket | null = null;

const resolveSocketUrl = () => {
  const configuredUrl = import.meta.env.VITE_WS_URL;
  if (configuredUrl && configuredUrl !== 'auto') return configuredUrl;
  if (typeof window === 'undefined') return 'http://localhost:3333';
  return `${window.location.protocol}//${window.location.hostname}:3333`;
};

export function getSocket() {
  const token = authToken.get();
  if (!token) return null;
  if (!socket) socket = io(resolveSocketUrl(), { auth: { token: `Bearer ${token}` }, autoConnect: false });
  return socket;
}
export function disconnectSocket() { socket?.disconnect(); socket = null; }
