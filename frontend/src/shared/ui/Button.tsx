import { Button as ShadcnButton } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; loading?: boolean };
export function Button({ className, variant = 'primary', loading, disabled, children, ...props }: Props) {
  const shadcnVariant = variant === 'danger' ? 'destructive' : variant === 'primary' ? 'default' : variant;
  return <ShadcnButton variant={shadcnVariant} size="lg" className={className} disabled={disabled || loading} {...props}>{loading && <LoaderCircle className="animate-spin" aria-hidden />}{children}</ShadcnButton>;
}
