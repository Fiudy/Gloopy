import { cn } from './cn';
export function Avatar({ name, src, online, className }: { name: string; src?: string | null; online?: boolean; className?: string }) {
  return <span className={cn('relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-visible rounded-2xl bg-gloopy-primary-deep font-display font-semibold text-white', className)}>{src ? <img src={src} alt="" className="h-full w-full rounded-2xl object-cover" /> : name.slice(0, 2).toUpperCase()}{online !== undefined && <span className={cn('absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-gloopy-bg-dark', online ? 'bg-gloopy-status-online' : 'bg-gloopy-status-offline')}><span className="sr-only">{online ? 'Online' : 'Offline'}</span></span>}</span>;
}
