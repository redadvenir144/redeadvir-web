'use client';

import { PLATFORMS, type Platform } from '@/lib/config/site';

// Iconos SVG para cada plataforma
function PlatformIcon({ icon }: { icon: Platform['icon'] }) {
  switch (icon) {
    case 'roku':
      return (
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      );
    case 'firetv':
      return (
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
    case 'mobile':
      return (
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
        </svg>
      );
    case 'web':
      return (
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
    default:
      return (
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" />
        </svg>
      );
  }
}

function ctaLabel(p: Platform): string {
  if (p.icon === 'web') return 'Assistir agora';
  if (p.icon === 'mobile') return 'Baixar app';
  return 'Abrir loja';
}

function PlatformCard({ platform }: { platform: Platform }) {
  const isInternal = platform.href.startsWith('/') || platform.href.startsWith('#');

  if (!platform.available) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 opacity-60">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-white/60">
          <PlatformIcon icon={platform.icon} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{platform.name}</h3>
          <p className="mt-1 text-sm text-white/60">{platform.description}</p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/50">
          Em breve
        </span>
      </div>
    );
  }

  return (
    <a
      href={platform.href}
      {...(isInternal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:bg-white/10 hover:shadow-lg hover:shadow-brand-500/10"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/20 text-brand-400 transition-colors group-hover:from-brand-500/30 group-hover:to-brand-600/30 group-hover:text-brand-300">
        <PlatformIcon icon={platform.icon} />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-white">{platform.name}</h3>
        <p className="mt-1 text-sm text-white/70">{platform.description}</p>
      </div>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">
        {ctaLabel(platform)}
        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </a>
  );
}

export function SmartTVSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-tv-bg to-tv-card">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-600/10 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-400">
            Disponível na sua tela grande
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Leve a Rede Advir para sua Smart TV
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Instale nosso app gratuito e aproveite a transmissão em HD na sua tela favorita.
            Disponível para as principais plataformas.
          </p>
        </div>

        {/* Platform grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PLATFORMS.map((platform) => (
            <PlatformCard key={platform.name} platform={platform} />
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-center text-sm text-white/50">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>100% Gratuito</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Transmissão 24 horas</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Qualidade HD</span>
          </div>
        </div>
      </div>
    </section>
  );
}
