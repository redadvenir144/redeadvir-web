import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout';
import { socialMetadata } from '@/lib/seo';
import Link from 'next/link';
import { Card, EmptyState, EmptyContentIcon } from '@/components/ui';
import { videosRepository } from '@/lib/data';
import type { Video } from '@/types/content';

export const metadata: Metadata = {
  title: 'Vídeos',
  description:
    'Assista aos melhores vídeos da REDE ADVIR: sermões, músicas, documentários e muito mais conteúdo edificante.',
  ...socialMetadata({
    title: 'Vídeos',
    description:
      'Assista aos melhores vídeos da REDE ADVIR: sermões, músicas, documentários e muito mais conteúdo edificante.',
  }),
};

/** El catálogo se edita desde /admin/videos, así que no se prerenderiza. */
export const revalidate = 300;

function PlayIcon() {
  return (
    <svg
      className="h-12 w-12 text-white drop-shadow-lg"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/** "45:30" a partir de segundos. Vacío si no se conoce la duración. */
function formatDuration(totalSeconds: number): string | null {
  if (totalSeconds <= 0) return null;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function VideoCard({ video }: { video: Video }) {
  const duration = formatDuration(video.durationSeconds);

  // Sin URL no hay a dónde ir: la tarjeta se muestra, pero no enlaza a una
  // página que daría 404.
  const content = (
    <Card hover={Boolean(video.url)} padding="none" className="overflow-hidden h-full">
      <div className="relative aspect-video bg-gray-100 dark:bg-tv-elevated">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-600/20 to-brand-800/40">
          <div className="transform transition-transform duration-300 group-hover:scale-110">
            <PlayIcon />
          </div>
        </div>
        {duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs font-medium text-white tabular-nums">
            {duration}
          </div>
        )}
      </div>

      <div className="p-4">
        {video.category && (
          <span className="text-xs font-medium text-brand-600 dark:text-brand-400 uppercase tracking-wide">
            {video.category.name}
          </span>
        )}
        <h3 className="mt-1 text-base font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
          {video.title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-text-muted">
          {new Date(video.publishedAt).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>
    </Card>
  );

  if (!video.url) {
    return <article className="group block">{content}</article>;
  }

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-xl"
      aria-label={`Assistir ${video.title}`}
    >
      {content}
    </a>
  );
}

export default async function VideosPage() {
  const videos = await videosRepository.getAll();

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Vídeos' }]} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Vídeos
        </h1>
        <p className="text-gray-600 dark:text-text-secondary">
          Assista ao melhor conteúdo da REDE ADVIR
        </p>
      </header>

      {videos.length === 0 ? (
        <EmptyState
          icon={<EmptyContentIcon />}
          title="Nenhum vídeo por enquanto"
          description="Enquanto isso, assista à transmissão ao vivo."
          action={
            <Link
              href="/"
              className={[
                'inline-flex items-center justify-center gap-2',
                'px-4 py-2.5 min-h-11',
                'bg-brand-600 text-white font-medium rounded-lg',
                'hover:bg-brand-700 active:bg-brand-800 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
              ].join(' ')}
            >
              Assistir ao vivo
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          href="/"
          className={[
            'inline-flex items-center gap-2 px-6 py-3 min-h-11',
            'bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl',
            'transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          ].join(' ')}
        >
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
        </Link>
      </div>
    </main>
  );
}
