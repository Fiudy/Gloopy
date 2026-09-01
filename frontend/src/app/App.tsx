import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '../features/auth/auth-store';
import { AppShell, PlaceholderPage } from '../features/conversations/AppShell';
import { AsyncState } from '../shared/ui/AsyncState';

const AuthPage = lazy(() => import('../features/auth/AuthPage').then((module) => ({ default: module.AuthPage })));
const ChatPage = lazy(() => import('../features/conversations/ChatPage').then((module) => ({ default: module.ChatPage })));
const ConversationsPage = lazy(() => import('../features/conversations/ConversationsPage').then((module) => ({ default: module.ConversationsPage })));
const GroupSettingsPage = lazy(() => import('../features/conversations/GroupSettingsPage').then((module) => ({ default: module.GroupSettingsPage })));
const NewConversationPage = lazy(() => import('../features/conversations/NewConversationPage').then((module) => ({ default: module.NewConversationPage })));
const LandingPage = lazy(() => import('../features/landing/LandingPage').then((module) => ({ default: module.LandingPage })));
const ProfilePage = lazy(() => import('../features/profile/ProfilePage').then((module) => ({ default: module.ProfilePage })));
const NotFoundPage = lazy(() => import('./NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

function Protected() { return useAuthStore((state) => state.isAuthenticated) ? <AppShell /> : <Navigate to="/login" replace />; }

export function App() {
  return <Suspense fallback={<AsyncState kind="loading" description="Preparando o Gloopy." />}><Routes>
    <Route path="/" element={<LandingPage />} /><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} />
    <Route element={<Protected />}><Route path="/conversations" element={<ConversationsPage />} /><Route path="/conversations/new" element={<NewConversationPage />} /><Route path="/conversations/:id" element={<ChatPage />} /><Route path="/conversations/:id/settings" element={<GroupSettingsPage />} /><Route path="/games" element={<PlaceholderPage title="Seus jogos" description="Os convites e partidas aparecem dentro de cada conversa para manter todo mundo no mesmo ritmo." />} /><Route path="/profile" element={<ProfilePage />} /></Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes></Suspense>;
}
