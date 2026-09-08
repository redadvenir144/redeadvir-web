import Link from 'next/link';
import Image from 'next/image';
import { SITE_NAME } from '@/lib/config/site';

/**
 * Logo del canal.
 */
export function Logo() {
  return (
    <Link
      href="/"
      className={[
        'min-h-11 flex items-center',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-tv-bg',
      ].join(' ')}
    >
      <span className="sr-only">{SITE_NAME} - Ir para a página inicial</span>
      <Image
        src="/images/logo.png"
        alt=""
        width={200}
        height={200}
        className="h-20 w-auto ml-4"
        priority
        aria-hidden="true"
      />
    </Link>
  );
}
