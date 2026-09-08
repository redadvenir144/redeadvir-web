import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui';
import { SITE_NAME, SITE_TAGLINE, SATELLITE_INFO, APP_LINKS, MINISTRY_INFO, GMI_CHANNELS } from '@/lib/config/site';

export const metadata: Metadata = {
  title: `Sobre | ${SITE_NAME}`,
  description:
    'Conheça a REDE ADVIR, o canal da volta de Jesus. Nossa missão é levar esperança e a mensagem do evangelho a todos os lares.',
  openGraph: {
    title: `Sobre | ${SITE_NAME}`,
    description:
      'Conheça a REDE ADVIR, o canal da volta de Jesus. Nossa missão é levar esperança.',
    type: 'website',
  },
};

function SatelliteIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
    </svg>
  );
}

function TvIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

export default function SobrePage() {
  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      {/* Hero */}
      <header className="text-center mb-16">
        <div className="mb-6">
          <Image
            src="/images/logo.png"
            alt={SITE_NAME}
            width={200}
            height={200}
            className="h-32 w-auto mx-auto"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {SITE_NAME}
        </h1>
        <p className="text-xl text-brand-400 font-medium">
          {SITE_TAGLINE}
        </p>
      </header>

      {/* Misión */}
      <section className="mb-16">
        <Card padding="lg" className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Nossa Missão</h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
            A REDE ADVIR é um canal de televisão cristão dedicado a proclamar a mensagem
            de esperança do breve retorno de Jesus Cristo. Nossa missão é alcançar cada lar
            com programação edificante, estudos bíblicos profundos e conteúdo que
            transforma vidas através do poder do evangelho.
          </p>
        </Card>
      </section>

      {/* História e GMI */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* História */}
          <Card padding="lg">
            <h2 className="text-2xl font-bold text-white mb-4">Nossa História</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              A Rede Advir Televisão é uma rede de televisão cristã, sem fins lucrativos,
              fundada em {MINISTRY_INFO.foundedYear} pelo {MINISTRY_INFO.founder}. Atualmente
              transmitimos televisão por meio de sinal aberto, cabo, satélite, streaming
              e redes sociais, alcançando uma audiência global.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Fazemos parte da {MINISTRY_INFO.name}, avançando com o esforço de voluntários
              comprometidos em compartilhar o evangelho e a esperança do breve retorno de Cristo.
            </p>
            <a
              href={MINISTRY_INFO.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 mt-4 transition-colors"
            >
              Conhecer a GMI
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </Card>

          {/* Rede GMI */}
          <Card padding="lg">
            <h2 className="text-2xl font-bold text-white mb-4">Rede GMI no Mundo</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Somos parte de uma rede global de canais de TV cristãos que transmitem
              a mensagem do evangelho em diversos idiomas ao redor do mundo.
            </p>
            <ul className="space-y-3">
              {GMI_CHANNELS.map((channel) => (
                <li key={channel.name}>
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-tv-elevated rounded-lg hover:bg-tv-hover transition-colors"
                  >
                    <div>
                      <p className="text-white font-medium">{channel.name}</p>
                      <p className="text-text-muted text-sm">{channel.region} · {channel.language}</p>
                    </div>
                    <svg className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* Como Assistir */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Como Assistir
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Satélite */}
          <Card hover padding="lg" className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-600/20 text-brand-400 mb-4">
              <SatelliteIcon />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Via Satélite</h3>
            <p className="text-text-secondary mb-4">
              Assista pelo satélite em todo o Brasil
            </p>
            <div className="bg-tv-elevated rounded-lg p-4">
              <p className="text-sm text-text-muted">Operadora</p>
              <p className="text-lg font-bold text-white">{SATELLITE_INFO.provider}</p>
              <p className="text-sm text-text-muted mt-2">Canal</p>
              <p className="text-2xl font-bold text-brand-400">{SATELLITE_INFO.channel}</p>
            </div>
          </Card>

          {/* Web */}
          <Card hover padding="lg" className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-600/20 text-brand-400 mb-4">
              <GlobeIcon />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Pela Internet</h3>
            <p className="text-text-secondary mb-4">
              Assista ao vivo de qualquer lugar do mundo
            </p>
            <Link
              href="/"
              className={[
                'inline-flex items-center justify-center gap-2 w-full',
                'px-4 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl',
                'transition-colors',
              ].join(' ')}
            >
              <TvIcon />
              Assistir Agora
            </Link>
          </Card>

          {/* App */}
          <Card hover padding="lg" className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-600/20 text-brand-400 mb-4">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Pelo Celular</h3>
            <p className="text-text-secondary mb-4">
              Baixe nosso app gratuito
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={APP_LINKS.android}
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  'inline-flex items-center justify-center gap-2',
                  'px-4 py-3 bg-tv-elevated hover:bg-tv-hover border border-tv-border text-white rounded-xl',
                  'transition-colors text-sm',
                ].join(' ')}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 2.047a.5.5 0 0 0-.726.45v.002L14.033 6.8a9.454 9.454 0 0 0-4.066 0L7.203 2.499a.5.5 0 0 0-.726-.45.5.5 0 0 0-.273.45l.001 4.3A9.5 9.5 0 0 0 2 14.5v.5a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-.5a9.5 9.5 0 0 0-4.205-7.801l.001-4.2a.5.5 0 0 0-.273-.451zM8.5 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM3 17a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0v-3a1 1 0 0 0-1-1zm18 0a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0v-3a1 1 0 0 0-1-1zM5 17h14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4z" />
                </svg>
                Google Play
              </a>
              <a
                href={APP_LINKS.ios}
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  'inline-flex items-center justify-center gap-2',
                  'px-4 py-3 bg-tv-elevated hover:bg-tv-hover border border-tv-border text-white rounded-xl',
                  'transition-colors text-sm',
                ].join(' ')}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* Valores */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Nossos Valores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <HeartIcon />,
              title: 'Amor',
              description: 'Compartilhamos o amor de Deus em tudo o que fazemos',
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              ),
              title: 'Verdade',
              description: 'Pregamos a Palavra de Deus com fidelidade',
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              ),
              title: 'Comunidade',
              description: 'Unimos famílias através da fé',
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ),
              title: 'Esperança',
              description: 'Proclamamos a breve volta de Jesus',
            },
          ].map((value) => (
            <Card key={value.title} padding="lg" className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-600/20 text-brand-400 mb-4">
                {value.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
              <p className="text-text-secondary text-sm">{value.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Card padding="lg" className="bg-gradient-to-r from-brand-700 to-brand-600 border-none">
          <h2 className="text-2xl font-bold text-white mb-4">
            Junte-se a Nós
          </h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Faça parte dessa família que cresce a cada dia. Assista nossa programação
            e deixe a mensagem de esperança transformar sua vida.
          </p>
          <Link
            href="/"
            className={[
              'inline-flex items-center gap-2 px-8 py-4',
              'bg-white text-brand-700 font-bold rounded-xl',
              'hover:bg-white/90 transition-colors',
            ].join(' ')}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Assistir Ao Vivo
          </Link>
        </Card>
      </section>
    </main>
  );
}
