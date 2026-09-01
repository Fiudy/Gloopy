import axios, { AxiosError } from 'axios';

const TOKEN_KEY = 'gloopy_access_token';
const resolveApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL;
  if (configuredUrl && configuredUrl !== 'auto') return configuredUrl;
  if (typeof window === 'undefined') return 'http://localhost:3333';
  return `${window.location.protocol}//${window.location.hostname}:3333`;
};

export const authToken = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const api = axios.create({ baseURL: resolveApiBaseUrl() });
api.interceptors.request.use((config) => {
  const token = authToken.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      authToken.clear();
      localStorage.removeItem('gloopy_user');
      if (!window.location.pathname.startsWith('/login')) window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export function apiErrorMessage(error: unknown, fallback = 'Não foi possível concluir. Tente novamente.') {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (Array.isArray(data?.message)) return data.message[0] ?? fallback;
    if (data?.message) return data.message;
    if (!error.response) return 'Sem conexão com o Gloopy. Confira sua internet e tente novamente.';
  }
  return fallback;
}
