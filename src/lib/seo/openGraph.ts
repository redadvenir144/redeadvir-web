import type { Metadata } from 'next';
import { SITE_NAME, SITE_LONG_NAME } from '@/lib/config/site';

/** Imagen social por defecto, 1200×630. */
export const OG_IMAGE = {
  url: '/images/og-image.jpg',
  width: 1200,
  height: 630,
  alt: `${SITE_LONG_NAME} — ${SITE_NAME}`,
} as const;

type OpenGraph = NonNullable<Metadata['openGraph']>;
type Twitter = NonNullable<Metadata['twitter']>;

/**
 * Construye `openGraph` + `twitter` para una página.
 *
 * Next **reemplaza** el `openGraph` del layout raíz cuando una página define
 * el suyo, en vez de fusionarlo. Sin este helper, cada página que personaliza
 * su título social se quedaba sin `og:image`, que es justo lo que se ve al
 * compartir un enlace por WhatsApp.
 */
export function socialMetadata(options: {
  title: string;
  description: string;
  type?: 'website' | 'article' | 'video.tv_show';
}): { openGraph: OpenGraph; twitter: Twitter } {
  const title = `${options.title} | ${SITE_NAME}`;

  return {
    openGraph: {
      title,
      description: options.description,
      type: options.type ?? 'website',
      siteName: SITE_NAME,
      locale: 'pt_BR',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: options.description,
      images: [OG_IMAGE.url],
    },
  };
}
