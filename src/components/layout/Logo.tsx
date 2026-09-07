import Link from 'next/link';
import { SITE_NAME } from '@/lib/config/site';

interface LogoProps {
  /** Variante de color */
  variant?: 'default' | 'inverse';
}

/**
 * Logo del canal.
 * Por ahora es un placeholder tipográfico hasta tener el SVG real.
 */
export function Logo({ variant = 'default' }: LogoProps) {
  return (
    <Link
      href="/"
      className={[
        'font-bold text-xl tracking-tight',
        'min-h-11 min-w-11 flex items-center',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
        variant === 'inverse' ? 'text-white' : 'text-brand-600',
      ].join(' ')}
    >
      {/* TODO: reemplazar con el SVG real del logo */}
      <span className="sr-only">{SITE_NAME} - Ir para a página inicial</span>
      <span aria-hidden="true">{SITE_NAME}</span>
    </Link>
  );
}
