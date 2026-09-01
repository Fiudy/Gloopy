# Page dependency trees

## `/` Landing
- `frontend/src/features/landing/LandingPage.tsx`
  - `react-router-dom`
  - `lucide-react`
- `frontend/src/index.css`
- `frontend/tailwind.config.ts`

## `/login`, `/register`
- `frontend/src/features/auth/AuthPage.tsx`
  - `frontend/src/features/auth/auth-store.ts`
  - `frontend/src/shared/api/services.ts`
  - `frontend/src/shared/api/client.ts`
  - `frontend/src/shared/ui/Button.tsx`
  - shadcn input/label/alert

## `/conversations`
- `frontend/src/features/conversations/ConversationsPage.tsx`
  - `frontend/src/shared/api/services.ts`
  - `frontend/src/shared/ui/AsyncState.tsx`
  - `frontend/src/shared/ui/Avatar.tsx`
- `frontend/src/features/conversations/AppShell.tsx`

## `/conversations/:id`
- `frontend/src/features/conversations/ChatPage.tsx`
  - `frontend/src/features/games/GameInviteCard.tsx`
  - `frontend/src/shared/api/services.ts`
  - `frontend/src/shared/api/socket.ts`
  - `frontend/src/shared/ui/AsyncState.tsx`
  - `frontend/src/shared/ui/Avatar.tsx`
  - `frontend/src/shared/ui/Button.tsx`
  - shadcn dropdown menu

## `/profile`
- `frontend/src/features/profile/ProfilePage.tsx`
  - `frontend/src/features/auth/auth-store.ts`
  - `frontend/src/shared/api/services.ts`
  - `frontend/src/shared/ui/AsyncState.tsx`
  - `frontend/src/shared/ui/Avatar.tsx`
  - `frontend/src/shared/ui/Button.tsx`
  - shadcn alert/input/label/switch
