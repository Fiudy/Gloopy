# Gloopy Design System

## Product and experience

Gloopy is a responsive web social chat for 1:1 and group conversations with embedded mini-games. The experience should feel vibrant, confident, playful, and culturally current: Discord's social density, Duolingo's friendliness, and a restrained streetwear energy. It must never look childish or like a generic admin dashboard.

Core routes: public landing, login, registration, conversation list, individual conversation, create group, group settings, user profile/settings, tic-tac-toe invite and live board, plus light 404/error states.

Primary jobs: understand the product quickly, create an account without friction, scan unread/pending conversations, communicate with text/media, manage groups according to role, and accept/play a game without leaving the conversation.

## Official assets

Use only the provided mascot PNGs. Do not redraw, replace, recolor, or generate alternatives.

- `gloopy-waving.png`: landing hero and onboarding.
- `gloopy-texting.png`: product/how-it-works feature section.
- `gloopy-thumbsup.png`: success and final CTA.
- `gloopy-sleeping.png`: empty states, offline, light errors/404.
- `gloopy-icon.png`: favicon, app icon, system avatar.
- `gloopy-cool.png`: loading and dark splash moments.
- `gloopy-cool-icon.png`: compact icon on dark surfaces.

## Color tokens

All implementation colors must reference semantic Tailwind tokens. No loose hex values in components.

- `gloopy-primary`: #7C4DFF — active navigation, focus, key highlights.
- `gloopy-primary-deep`: #6C3AC9 — elevated purple surfaces and pressed states.
- `gloopy-accent`: #FF8A3D — primary CTA and energetic accents.
- `gloopy-bg-dark`: #13111C — primary app background.
- `gloopy-bg-light`: #F7F5FF — light foreground contrast.
- `gloopy-surface`: #1D1929 — base card and panel.
- `gloopy-surface-raised`: #272136 — elevated card and hover panel.
- `gloopy-border`: #3B3150 — dark-surface border.
- `gloopy-muted`: #B7ADC9 — secondary copy on dark.
- `gloopy-status-online`: #4ADE80.
- `gloopy-status-away`: #FBBF24.
- `gloopy-status-offline`: #9CA3AF.
- `gloopy-danger`: #FB7185.

Primary text on dark surfaces is `gloopy-bg-light`. Primary text on accent orange uses `gloopy-bg-dark` for accessible contrast. Purple buttons use near-white text. Focus rings use accent orange with a visible offset on dark backgrounds.

## Typography

- Display and brand: Fredoka, rounded, confident, weights 600–700. Preserve sentence case for warmth; short labels can be uppercase with restrained letter spacing.
- Body and UI: Inter, weights 400–700.
- Landing display sizes are fluid using clamp; application headings remain compact and practical.

## Shape, spacing, and depth

- Base spacing unit: 4px. Common gaps: 8, 12, 16, 24, 32, 48, 64px.
- Inputs/buttons: 12–14px radius. Cards: 18–24px radius. Pills and avatars: fully rounded.
- Controls are at least 44px tall and touch targets at least 44×44px.
- Use subtle purple-tinted borders and restrained layered shadows. Glows are reserved for mascot framing, game state, and primary marketing moments.
- Landing sections may use angled bands, offset borders, kinetic badges, and bold type inspired by Kinetic Orange. Internal screens use a steadier grid and quieter surfaces.

## Layout

- Mobile first. At ~375px, one full-screen task at a time with bottom navigation and an explicit back action from chat.
- Tablet at ~768px uses a compact rail/list and content area where space permits.
- Desktop at ~1280px uses a three-part social shell where appropriate: navigation rail, conversation list, active conversation/details.
- Content widths and line lengths remain comfortable; forms max at roughly 440px.
- Landing navigation is floating and rounded. The hero uses an asymmetrical text/mascot composition, with the mascot fully visible and never cropped at the hands.

## Components

- Buttons: accent-filled primary, purple secondary, dark ghost, and danger. Include hover, focus-visible, active, loading, and disabled states.
- Inputs: persistent labels, optional leading/trailing controls, inline errors connected with `aria-describedby`, visible focus state.
- Cards: dark raised surface, 1px semantic border, 20px radius. Interactive cards lift by 2px and brighten border on hover.
- Conversation rows: avatar/presence, name/time, preview, unread count. Pending direct rows receive a distinct orange-tinted callout, never color alone.
- Message bubbles: own messages purple; incoming messages raised dark; system messages centered and quiet; game invites are high-emphasis cards.
- Game board: large square cells, visible turn state, keyboard operable cells, X in orange and O in purple/light contrast.
- Async states: mascot + concise status + clear retry/primary action. Loading uses `gloopy-cool.png`; empty uses `gloopy-sleeping.png`.

## Motion and microinteractions

- Durations: 150ms control feedback, 220ms panels/cards, 350–500ms landing entrances.
- Easing: cubic-bezier(0.2, 0.8, 0.2, 1).
- Landing can use a slow horizontal marquee and subtle floating mascot/parallax. Avoid continuous motion in core chat tasks.
- Respect `prefers-reduced-motion`: remove transforms and continuous animations.
- Hover states may shift an arrow or card by 2–4px; never use large jumps that destabilize layout.

## Accessibility and content

- Semantic landmarks, heading order, labeled fields, descriptive alt text, keyboard navigation, visible focus, and status announcements via live regions.
- Do not rely on color alone for presence, unread, errors, or game turns.
- Error messages are specific and actionable in Brazilian Portuguese.
- Do not create mascot gestures. Use supplied images only.

## Technical constraints

React 18, TypeScript, Vite, TailwindCSS tokens, React Router, TanStack Query, Zustand or narrow Context, socket.io-client, Zod, React Hook Form, and lucide-react. One shared HTTP client owns base URL, authorization, JSON/error parsing, and multipart uploads. API/WS URLs come only from Vite environment variables.
