# Theme

Sources: `frontend/src/index.css`, `frontend/tailwind.config.ts`, `.superdesign/design-system.md`.

Stack: Tailwind CSS 3 + shadcn/Radix. Dark-first.

Core tokens:

```css
:root {
  --background: #13111c;
  --foreground: #f7f5ff;
  --card: #1d1929;
  --card-foreground: #f7f5ff;
  --popover: #272136;
  --popover-foreground: #f7f5ff;
  --primary: #7c4dff;
  --primary-foreground: #ffffff;
  --secondary: #272136;
  --secondary-foreground: #f7f5ff;
  --muted: #272136;
  --muted-foreground: #b7adc9;
  --accent: #ff8a3d;
  --accent-foreground: #13111c;
  --destructive: #fb7185;
  --border: #3b3150;
  --input: #3b3150;
  --ring: #ff8a3d;
  --radius: 0.875rem;
}
```

```ts
fontFamily: { display: ['Fredoka', 'sans-serif'], body: ['Inter', 'sans-serif'] }
boxShadow: { glow: '0 0 50px rgba(124,77,255,.28)', card: '0 20px 60px rgba(0,0,0,.28)' }
colors.gloopy = {
  primary: '#7C4DFF', primaryDeep: '#6C3AC9', accent: '#FF8A3D',
  bgDark: '#13111C', bgLight: '#F7F5FF', surface: '#1D1929',
  surfaceRaised: '#272136', border: '#3B3150', muted: '#B7ADC9',
  danger: '#FB7185', online: '#4ADE80', away: '#FBBF24', offline: '#9CA3AF'
}
```

Motion respects `prefers-reduced-motion`. Official mascot assets only: waving=hero/welcome, texting=feature, thumbsup=success/CTA, sleeping=empty/offline, cool=loading/dark splash, icon variants=app marks.
