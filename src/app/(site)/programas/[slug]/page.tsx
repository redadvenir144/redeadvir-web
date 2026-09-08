import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { programsRepository, scheduleRepository } from '@/lib/data';
import type { BroadcastTime } from '@/lib/data/schedule.repository';
import { Button, Badge, LiveBadge, Card } from '@/components/ui';
import { ProgramImage } from '@/features/programs';
import { SITE_NAME, CHANNEL_TIMEZONE } from '@/lib/config/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Genera los params estáticos para todos los programas.
 */
export async function generateStaticParams() {
  const programs = await programsRepository.getAll();
  return programs.map((program) => ({
    slug: program.slug,
  }));
}

/**
 * Genera metadata dinámica para cada programa.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await programsRepository.getBySlug(slug);

  if (!program) {
    return {
      title: 'Programa não encontrado | REDE ADVIR',
    };
  }

  return {
    title: `${program.title} | ${SITE_NAME}`,
    description: program.description,
    openGraph: {
      title: `${program.title} | ${SITE_NAME}`,
      description: program.description,
      type: 'video.tv_show',
      // TODO: usar imagen real cuando esté disponible
      // images: [{ url: program.thumbnail.src, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${program.title} | ${SITE_NAME}`,
      description: program.description,
    },
  };
}

/**
 * Formatea un horario de emisión.
 */
function formatTime(time: BroadcastTime): string {
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
}

/**
 * Genera JSON-LD TVSeries para el programa.
 */
function generateTVSeriesJsonLd(
  program: { title: string; description: string; slug: string; category: { name: string } },
  broadcastTimes: BroadcastTime[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: program.title,
    description: program.description,
    url: `https://redeadvir.net.br/programas/${program.slug}`,
    genre: program.category.name,
    inLanguage: 'pt-BR',
    productionCompany: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    // Horarios como BroadcastEvent
    publication: broadcastTimes.map((time) => ({
      '@type': 'BroadcastEvent',
      isLiveBroadcast: true,
      startDate: `T${formatTime(time)}:00`,
      videoFormat: 'HD',
      publishedOn: {
        '@type': 'BroadcastService',
        name: SITE_NAME,
        broadcastDisplayName: SITE_NAME,
        broadcaster: {
          '@type': 'Organization',
          name: SITE_NAME,
        },
      },
    })),
  };
}

export default async function ProgramaPage({ params }: PageProps) {
  const { slug } = await params;
  const program = await programsRepository.getBySlug(slug);

  if (!program) {
    notFound();
  }

  const [broadcastTimes, isLive] = await Promise.all([
    scheduleRepository.getBroadcastTimesForProgram(slug),
    scheduleRepository.isProgramLiveNow(slug),
  ]);

  const jsonLd = generateTVSeriesJsonLd(program, broadcastTimes);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Navegação">
          <ol className="flex items-center gap-2 text-sm text-text-muted">
            <li>
              <Link
                href="/programas"
                className="hover:text-brand-600 transition-colors"
              >
                Programas
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="text-text-primary font-medium truncate">
              {program.title}
            </li>
          </ol>
        </nav>

        <article className="max-w-4xl">
          {/* Header del programa */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Imagen */}
              <div className="md:w-80 flex-shrink-0">
                <div className="relative">
                  <ProgramImage title={program.title} size="lg" />
                  {isLive && (
                    <div className="absolute top-3 left-3">
                      <LiveBadge />
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
                    {program.title}
                  </h1>
                </div>

                <Badge variant="muted" className="mb-4">
                  {program.category.name}
                </Badge>

                <p className="text-text-secondary mb-6 leading-relaxed">
                  {program.description}
                </p>

                {/* Botón de acción */}
                <Link
                  href="/"
                  className={[
                    'inline-flex items-center justify-center gap-2',
                    'px-6 py-3 min-h-11',
                    'font-semibold rounded-lg',
                    'transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    isLive
                      ? 'bg-live text-white hover:bg-red-700 focus-visible:ring-live'
                      : 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-600',
                  ].join(' ')}
                >
                  {isLive ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                      </span>
                      Assistir ao vivo
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Assistir ao vivo
                    </>
                  )}
                </Link>
              </div>
            </div>
          </header>

          {/* Horarios de emisión */}
          {broadcastTimes.length > 0 && (
            <Card padding="md" className="mb-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                Horários de exibição
              </h2>
              <p className="text-sm text-text-muted mb-3">
                Todos os dias • Horário de Brasília
              </p>
              <div className="flex flex-wrap gap-3">
                {broadcastTimes.map((time, index) => (
                  <div
                    key={index}
                    className={[
                      'px-4 py-2 rounded-lg text-center',
                      'bg-surface-muted',
                    ].join(' ')}
                  >
                    <span className="text-lg font-semibold text-text-primary tabular-nums">
                      {formatTime(time)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Info adicional */}
          <Card padding="md">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Sobre o programa
            </h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-text-muted">Categoria</dt>
                <dd className="font-medium text-text-primary">
                  {program.category.name}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Duração</dt>
                <dd className="font-medium text-text-primary">
                  {program.durationMinutes} minutos
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Exibições diárias</dt>
                <dd className="font-medium text-text-primary">
                  {broadcastTimes.length}x por dia
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Transmissão</dt>
                <dd className="font-medium text-text-primary">
                  Ao vivo e satélite
                </dd>
              </div>
            </dl>
          </Card>
        </article>
      </main>
    </>
  );
}
