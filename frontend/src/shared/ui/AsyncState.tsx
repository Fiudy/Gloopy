import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
type Props = { kind: 'loading' | 'empty' | 'error'; title?: string; description?: string; onRetry?: () => void };
export function AsyncState({ kind, title, description, onRetry }: Props) {
  const image = kind === 'loading' ? '/mascot/gloopy-cool.png' : kind === 'empty' ? '/mascot/gloopy-sleeping.png' : null;
  return <section className="flex min-h-72 flex-col items-center justify-center px-6 text-center" role={kind === 'error' ? 'alert' : 'status'}>
    {image ? <img src={image} alt="" className={kind === 'loading' ? 'mb-4 h-28 animate-pulse rounded-3xl' : 'mb-4 h-32 object-contain'} /> : <AlertTriangle className="mb-4 h-10 w-10 text-gloopy-accent" />}
    <h2 className="font-display text-2xl font-semibold">{title ?? (kind === 'loading' ? 'Só um pulinho…' : kind === 'empty' ? 'Tudo quieto por aqui' : 'Algo saiu do ritmo')}</h2>
    {description && <p className="mt-2 max-w-sm text-sm text-gloopy-muted">{description}</p>}
    {kind === 'error' && onRetry && <Button className="mt-5" onClick={onRetry}>Tentar novamente</Button>}
  </section>;
}
