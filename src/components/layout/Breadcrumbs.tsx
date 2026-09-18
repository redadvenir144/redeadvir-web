import Link from 'next/link';
import { JsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/config/site';

function HomeIcon() {
  return (
    <svg
      className="h-4 w-4 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
      />
    </svg>
  );
}

export interface Crumb {
  label: string;
  /** Sin href, es la página actual. */
  href?: string;
}

/**
 * Rastro de navegación, al estilo de Red ADvenir: «Início / Programação».
 *
 * Va en `<ol>` porque el orden importa; el último elemento no es enlace y
 * lleva `aria-current="page"`. Además emite `BreadcrumbList`, que es lo que
 * Google usa para mostrar la ruta bajo el resultado en vez de la URL cruda.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ label: 'Início', href: '/' }, ...items];

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: trail.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.label,
            ...(crumb.href ? { item: `${SITE_URL}${crumb.href}` } : {}),
          })),
        }}
      />

      <nav aria-label="Trilha de navegação" className="mb-4">
        <ol className="flex flex-wrap items-center gap-x-2 text-sm">
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1;

            return (
              <li key={crumb.label} className="flex items-center gap-x-2">
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="text-gray-600 dark:text-text-muted"
                  >
                    /
                  </span>
                )}

                {isLast || !crumb.href ? (
                  <span
                    aria-current="page"
                    className="text-gray-600 dark:text-text-secondary truncate max-w-[18ch] sm:max-w-none"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className={[
                      // `min-w-11` cumple el área táctil de 44x44 sin
                      // desplazar el texto: con justify-start el sobrante
                      // crece a la derecha.
                      'inline-flex items-center gap-1.5 min-h-11 min-w-11',
                      'font-medium text-brand-700 dark:text-brand-400',
                      'hover:underline',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded',
                    ].join(' ')}
                  >
                    {index === 0 && <HomeIcon />}
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
