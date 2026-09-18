import Link from 'next/link';
import Image from 'next/image';
import { SITE_NAME } from '@/lib/config/site';

/** Clases comunes a las dos versiones del logotipo. */
const LOGO_CLASSES = 'h-16 xl:h-20 w-auto ml-0 xl:ml-4';

/**
 * Logo del canal.
 *
 * Se usa el logotipo oficial, con el texto en blanco: la cabecera es oscura
 * en los dos temas. La variante `logo-azul.png` queda para /sobre, que va
 * sobre el fondo claro de la página.
 */
export function Logo() {
  return (
    <Link
      href="/"
      className={[
        'min-h-11 flex items-center flex-shrink-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-tv-bg',
      ].join(' ')}
    >
      <span className="sr-only">{SITE_NAME} - Ir para a página inicial</span>


      <Image
        src="/images/logo.png"
        alt=""
        width={512}
        height={512}
        className={LOGO_CLASSES}
        priority
        aria-hidden="true"
      />
    </Link>
  );
}
