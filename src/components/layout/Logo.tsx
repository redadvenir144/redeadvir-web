import Link from 'next/link';
import Image from 'next/image';
import { SITE_NAME } from '@/lib/config/site';

interface LogoProps {
  /** Variante de color (inverse para fondos oscuros) */
  variant?: 'default' | 'inverse';
}

/**
 * Logo del canal.
 */
export function Logo({ variant = 'default' }: LogoProps) {
  return (
    <Link
      href="/"
      className={[
        'min-h-11 flex items-center',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
      ].join(' ')}
    >
      <span className="sr-only">{SITE_NAME} - Ir para a página inicial</span>
      <Image
        src="/images/logo.png"
        alt=""
        width={144}
        height={110}
        className={[
          'h-10 w-auto',
          variant === 'inverse' ? 'brightness-0 invert' : '',
        ].join(' ')}
        priority
        aria-hidden="true"
      />
    </Link>
  );
}
