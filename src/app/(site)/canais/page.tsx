import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout';
import { socialMetadata } from '@/lib/seo';
import { Card } from '@/components/ui';
import { SatelliteSignalCard } from '@/components/sections';
import {
  GMI_CHANNELS,
  OPEN_TV_INFO,
  SATELLITE_INFO,
  MINISTRY_INFO,
} from '@/lib/config/site';

export const metadata: Metadata = {
  title: 'Canais',
  description:
    'Onde assistir à REDE ADVIR: TV aberta, satélite e os canais da rede GMI em espanhol, inglês, francês, alemão, italiano, húngaro e búlgaro.',
  ...socialMetadata({
    title: 'Canais',
    description:
      'Onde assistir à REDE ADVIR: TV aberta, satélite e os canais da rede GMI pelo mundo.',
  }),
};

function ExternalIcon() {
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
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  );
}

function TuneRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 border-b border-paper-border dark:border-tv-border last:border-b-0">
      <dt className="text-sm text-gray-600 dark:text-text-secondary">{label}</dt>
      <dd className="text-xl font-bold text-gray-900 dark:text-white tabular-nums">
        {value}
      </dd>
    </div>
  );
}

export default function CanaisPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Canais' }]} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Canais
        </h1>
        <p className="text-gray-600 dark:text-text-secondary">
          Onde sintonizar a REDE ADVIR e os demais canais da rede{' '}
          {MINISTRY_INFO.name}.
        </p>
      </header>

      {/* Como sintonizar REDE ADVIR */}
      <section className="mb-10" aria-labelledby="sintonizar-title">
        <h2
          id="sintonizar-title"
          className="text-xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Como sintonizar a REDE ADVIR
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <Card padding="lg">
            <dl>
              <TuneRow
                label={OPEN_TV_INFO.label}
                value={OPEN_TV_INFO.channel}
              />
              <TuneRow
                label={`Satélite ${SATELLITE_INFO.provider}`}
                value={SATELLITE_INFO.channel}
              />
            </dl>
          </Card>

          <SatelliteSignalCard />
        </div>
      </section>

      {/* Red GMI en el mundo */}
      <section aria-labelledby="rede-title">
        <h2
          id="rede-title"
          className="text-xl font-bold text-gray-900 dark:text-white mb-2"
        >
          A rede {MINISTRY_INFO.name} no mundo
        </h2>
        <p className="text-gray-600 dark:text-text-secondary mb-4">
          Canais irmãos que transmitem a mesma mensagem em outros idiomas.
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GMI_CHANNELS.map((channel) => {
            const body = (
              <>
                <span className="min-w-0">
                  <span className="block font-semibold text-gray-900 dark:text-white">
                    {channel.name}
                  </span>
                  <span className="block text-sm text-gray-600 dark:text-text-secondary mt-0.5">
                    {channel.region}
                  </span>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-tv-elevated dark:text-text-secondary">
                    {channel.language}
                  </span>
                </span>
                {channel.url && (
                  <span
                    className="text-brand-700 dark:text-brand-400 mt-1"
                    aria-hidden="true"
                  >
                    <ExternalIcon />
                  </span>
                )}
              </>
            );

            const base = [
              'flex items-start justify-between gap-3 h-full',
              'p-4 rounded-xl',
              'bg-paper-raised dark:bg-tv-card',
              'border border-paper-border dark:border-tv-border',
            ].join(' ');

            // Varios proyectos de la red aún no tienen sitio propio. Se
            // muestran igual, pero como tarjeta y no como enlace vacío.
            return (
              <li key={channel.name}>
                {channel.url ? (
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={[
                      base,
                      'min-h-11',
                      'hover:border-brand-400 hover:shadow-md',
                      'dark:hover:bg-tv-hover dark:hover:border-brand-600/40',
                      'transition-all',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                    ].join(' ')}
                  >
                    {body}
                  </a>
                ) : (
                  <div className={base}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
