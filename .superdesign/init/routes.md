# Routes

Framework: React 18 SPA, Vite, React Router 7.

| URL | Component | Layout |
|---|---|---|
| `/` | `frontend/src/features/landing/LandingPage.tsx` | Public, self-contained |
| `/login` | `frontend/src/features/auth/AuthPage.tsx` | Public |
| `/register` | `frontend/src/features/auth/AuthPage.tsx` | Public |
| `/conversations` | `frontend/src/features/conversations/ConversationsPage.tsx` | `AppShell` |
| `/conversations/new` | `frontend/src/features/conversations/NewConversationPage.tsx` | `AppShell` |
| `/conversations/:id` | `frontend/src/features/conversations/ChatPage.tsx` | `AppShell` |
| `/conversations/:id/settings` | `frontend/src/features/conversations/GroupSettingsPage.tsx` | `AppShell` |
| `/games` | Placeholder | `AppShell` |
| `/profile` | `frontend/src/features/profile/ProfilePage.tsx` | `AppShell` |

Router source: `frontend/src/app/App.tsx`. Public marketing pages to add in this redesign: `/recursos`, `/seguranca`, `/sobre`, `/games/tic-tac-toe`.
