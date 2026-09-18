import Link from 'next/link';
import { OPEN_TV_INFO } from '@/lib/config/site';

function TvIcon() {
  return (
    <svg
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 3l4 4 4-4M3.75 7.5h16.5a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5v-9a1.5 1.5 0 011.5-1.5z"
      />
    </svg>
  );
}

/**
 * Canal de TV aberta, destacado en la portada.
 *
 * El número va grande y con `tabular-nums`: buena parte de la audiencia lo va
 * a teclear en el mando de la tele mirando la pantalla del móvil, y a 360px un
 * número pequeño no sirve. La operadora de satélite ya aparece en la barra del
 * reproductor y en el pie, así que aquí no se repite.
 */
export function ChannelStrip() {
  return (
    <section
      className="max-w-6xl mx-auto px-4 lg:px-8 mt-6"
      aria-label="Canal na TV aberta"
    >
      <div
        className={[
          'flex items-center gap-4',
          'rounded-xl px-5 py-4',
          'bg-brand-50 dark:bg-tv-card',
          'border border-brand-200 dark:border-tv-border',
        ].join(' ')}
      >
        <span
          className="flex-shrink-0 text-brand-700 dark:text-brand-400"
          aria-hidden="true"
        >
          <TvIcon />
        </span>

        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0 min-w-0 flex-1">
          <span className="text-base font-medium text-gray-700 dark:text-text-secondary">
            {OPEN_TV_INFO.label}
          </span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums leading-tight">
            {OPEN_TV_INFO.channel}
          </span>
        </p>

        {/* Los parámetros de satélite viven en /canais, no aquí:
            en la portada estorbarían al directo. */}
        <Link
          href="/canais"
          className={[
            'flex-shrink-0 inline-flex items-center min-h-11 px-2',
            'text-sm font-semibold text-brand-700 dark:text-brand-400',
            'hover:underline',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded',
          ].join(' ')}
        >
          Satélite
          <svg
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
