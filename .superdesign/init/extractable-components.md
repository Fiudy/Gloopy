# Extractable components

## MarketingNav
- Source: current header inside `frontend/src/features/landing/LandingPage.tsx`
- Category: layout
- Description: Floating public navigation with mascot mark and auth CTAs.
- Extractable props: activeItem, loginHref, registerHref
- Hardcoded: mascot icon, labels, iconography, visual tokens

## AppShell
- Source: `frontend/src/features/conversations/AppShell.tsx`
- Category: layout
- Description: Authenticated responsive bottom navigation/sidebar.
- Extractable props: activeItem
- Hardcoded: route labels, mascot icon, Lucide icons

## GloopyButton
- Source: `frontend/src/shared/ui/Button.tsx`
- Category: basic
- Description: Brand action with primary, secondary and ghost states.

## GloopyAvatar
- Source: `frontend/src/shared/ui/Avatar.tsx`
- Category: basic
- Description: Image/fallback avatar with optional presence dot.

## AsyncState
- Source: `frontend/src/shared/ui/AsyncState.tsx`
- Category: basic
- Description: Loading, empty and error surfaces using official mascot poses.
