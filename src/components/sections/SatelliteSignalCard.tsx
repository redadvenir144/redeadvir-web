import { SATELLITE_SIGNAL } from '@/lib/config/site';

function DishIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18.75a6.75 6.75 0 006.75-6.75M12 21.75A9.75 9.75 0 0021.75 12M4.5 19.5l5.25-5.25m0 0a2.25 2.25 0 103.182-3.182L7.5 16.5z"
      />
    </svg>
  );
}

/**
 * Parámetros de recepción por satélite.
 *
 * Son datos que el usuario copia a mano en el receptor, así que van en una
 * lista de definición con `tabular-nums` y suficiente contraste, no en un
 * párrafo corrido.
 */
export function SatelliteSignalCard() {
  return (
    <section
      className={[
        'rounded-xl p-5 h-full',
        'bg-paper-raised dark:bg-tv-card',
        'border border-paper-border dark:border-tv-border',
      ].join(' ')}
      aria-labelledby="satellite-signal-title"
    >
      <header className="flex items-center gap-3 mb-4">
        <span
          className="flex-shrink-0 text-brand-700 dark:text-brand-400"
          aria-hidden="true"
        >
          <DishIcon />
        </span>
        <h2
          id="satellite-signal-title"
          className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wide"
        >
          {SATELLITE_SIGNAL.title}
        </h2>
      </header>

      <dl className="divide-y divide-paper-border dark:divide-tv-border">
        {SATELLITE_SIGNAL.params.map((param) => (
          <div
            key={param.label}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5"
          >
            <dt className="text-sm text-gray-600 dark:text-text-secondary">
              {param.label}
            </dt>
            <dd className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums text-right">
              {param.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
