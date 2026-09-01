import type { Config } from 'tailwindcss';
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)', foreground: 'var(--foreground)',
        border: 'var(--border)', input: 'var(--input)', ring: 'var(--ring)',
        card: { DEFAULT: 'var(--card)', foreground: 'var(--card-foreground)' },
        popover: { DEFAULT: 'var(--popover)', foreground: 'var(--popover-foreground)' },
        primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
        secondary: { DEFAULT: 'var(--secondary)', foreground: 'var(--secondary-foreground)' },
        muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
        accent: { DEFAULT: 'var(--accent)', foreground: 'var(--accent-foreground)' },
        destructive: 'var(--destructive)',
        gloopy: {
          primary: '#7C4DFF', 'primary-deep': '#6C3AC9', accent: '#FF8A3D',
          'bg-dark': '#13111C', 'bg-light': '#F7F5FF', surface: '#1D1929',
          'surface-raised': '#272136', border: '#3B3150', muted: '#B7ADC9',
          danger: '#FB7185', 'status-online': '#4ADE80', 'status-away': '#FBBF24', 'status-offline': '#9CA3AF'
        }
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
      fontFamily: { display: ['Fredoka', 'sans-serif'], body: ['Inter', 'sans-serif'] },
      boxShadow: { glow: '0 0 50px rgba(124,77,255,.28)', card: '0 20px 60px rgba(0,0,0,.28)' },
      animation: { float: 'float 5s ease-in-out infinite', 'fade-up': 'fade-up .5s cubic-bezier(.2,.8,.2,1) both' },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'translateY(0)' } }
      }
    }
  },
  plugins: []
} satisfies Config;
