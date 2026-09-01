# Shared UI primitives

## Button
Source: `frontend/src/shared/ui/Button.tsx`

```tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './cn';
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'secondary'|'ghost'; loading?: boolean };
export const Button = forwardRef<HTMLButtonElement, Props>(({className,variant='primary',loading,children,disabled,...props},ref)=><button ref={ref} disabled={disabled||loading} className={cn('inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 font-semibold transition focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-55',variant==='primary'&&'bg-gloopy-accent text-gloopy-bg-dark hover:-translate-y-0.5 hover:brightness-105',variant==='secondary'&&'bg-gloopy-primary text-white hover:bg-gloopy-primary-deep',variant==='ghost'&&'border bg-transparent text-white hover:bg-white/10',className)} {...props}>{loading&&<Loader2 className="h-4 w-4 animate-spin" aria-hidden/>}{children}</button>);
Button.displayName='Button';
```

## Avatar
Source: `frontend/src/shared/ui/Avatar.tsx`

```tsx
import { cn } from './cn';
export function Avatar({name,src,online=false,className}:{name:string;src?:string|null;online?:boolean;className?:string}){const initials=name.split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase();return <span className={cn('relative grid h-12 w-12 shrink-0 place-items-center overflow-visible rounded-2xl bg-gloopy-primary font-display font-bold text-white',className)}>{src?<img src={src} alt="" className="h-full w-full rounded-2xl object-cover"/>:<span>{initials}</span>}{online&&<span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-gloopy-surface bg-gloopy-status-online" aria-label="Online"/>}</span>}
```

## AsyncState
Source: `frontend/src/shared/ui/AsyncState.tsx`

```tsx
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
export function AsyncState({kind,title,description,onRetry}:{kind:'loading'|'empty'|'error';title?:string;description:string;onRetry?:()=>void}){const image=kind==='loading'?'/mascot/gloopy-cool.png':'/mascot/gloopy-sleeping.png';return <div className="grid min-h-[360px] place-items-center p-6 text-center"><div className="max-w-sm"><img src={image} alt="" className="mx-auto h-32 w-32 rounded-3xl object-cover"/><h2 className="mt-5 font-display text-2xl font-bold">{title??(kind==='loading'?'Só um instante…':kind==='empty'?'Nada por aqui ainda':'Algo saiu do ritmo')}</h2><p className="mt-2 text-sm text-gloopy-muted">{description}</p>{onRetry&&<Button variant="ghost" className="mt-5" onClick={onRetry}><RefreshCw className="h-4 w-4"/>Tentar de novo</Button>}{kind==='error'&&!onRetry&&<AlertTriangle className="mx-auto mt-4 text-gloopy-danger"/>}</div></div>}
```

The project also owns shadcn primitives under `frontend/src/components/ui/`: alert, avatar, badge, button, card, dialog, dropdown-menu, input, label, separator, sheet, skeleton, switch, tabs, textarea and tooltip. They use Radix UI, `cn`, semantic CSS variables, keyboard focus and forwarded refs.
