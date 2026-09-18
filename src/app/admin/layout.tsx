import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/**
 * El panel nunca se indexa, con independencia de lo que haga el sitio público.
 */
export const metadata: Metadata = {
  title: 'Painel · REDE ADVIR',
  robots: { index: false, follow: false, nocache: true },
};

/**
 * El panel siempre se renderiza en cada petición: muestra datos que se acaban
 * de editar, así que cachearlo mostraría contenido viejo.
 */
export const dynamic = 'force-dynamic';

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
