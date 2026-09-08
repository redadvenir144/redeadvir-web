import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui';
import { SITE_NAME } from '@/lib/config/site';

export const metadata: Metadata = {
  title: `Vídeos | ${SITE_NAME}`,
  description:
    'Assista aos melhores vídeos da REDE ADVIR: sermões, músicas, documentários e muito mais conteúdo edificante.',
  openGraph: {
    title: `Vídeos | ${SITE_NAME}`,
    description:
      'Assista aos melhores vídeos da REDE ADVIR: sermões, músicas, documentários e muito mais.',
    type: 'website',
  },
};

// Mock de videos hasta tener datos reales
const MOCK_VIDEOS = [
  {
    id: '1',
    title: 'Sermão: A Esperança que Temos',
    thumbnail: null,
    duration: '45:30',
    category: 'Sermões',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'Música: Hinos de Louvor',
    thumbnail: null,
    duration: '32:15',
    category: 'Música',
    date: '2024-01-14',
  },
  {
    id: '3',
    title: 'Estudo Bíblico: Apocalipse',
    thumbnail: null,
    duration: '58:00',
    category: 'Estudos',
    date: '2024-01-13',
  },
  {
    id: '4',
    title: 'Documentário: História da Igreja',
    thumbnail: null,
    duration: '1:20:00',
    category: 'Documentários',
    date: '2024-01-12',
  },
  {
    id: '5',
    title: 'Testemunho: Uma Nova Vida',
    thumbnail: null,
    duration: '25:45',
    category: 'Testemunhos',
    date: '2024-01-11',
  },
  {
    id: '6',
    title: 'Sermão: Fé e Perseverança',
    thumbnail: null,
    duration: '42:00',
    category: 'Sermões',
    date: '2024-01-10',
  },
];

const CATEGORIES = ['Todos', 'Sermões', 'Música', 'Estudos', 'Documentários', 'Testemunhos'];

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

function VideoCard({
  video,
}: {
  video: (typeof MOCK_VIDEOS)[0];
}) {
  return (
    <Link href={`/videos/${video.id}`} className="group block">
      <Card hover padding="none" className="overflow-hidden">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-tv-elevated">
          {/* Placeholder con icono de play */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-600/20 to-brand-800/40">
            <div className="transform transition-transform duration-300 group-hover:scale-110">
              <PlayIcon />
            </div>
          </div>
          {/* Duración */}
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs font-medium text-white">
            {video.duration}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <span className="text-xs font-medium text-brand-400 uppercase tracking-wide">
            {video.category}
          </span>
          <h3 className="mt-1 text-base font-semibold text-white line-clamp-2 group-hover:text-brand-300 transition-colors">
            {video.title}
          </h3>
          <p className="mt-2 text-sm text-text-muted">
            {new Date(video.date).toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export default function VideosPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Vídeos</h1>
        <p className="text-text-secondary">
          Assista ao melhor conteúdo da REDE ADVIR
        </p>
      </header>

      {/* Filtros de categoría */}
      <nav className="mb-8 flex flex-wrap gap-2" aria-label="Filtrar por categoria">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              category === 'Todos'
                ? 'bg-brand-600 text-white'
                : 'bg-tv-card text-text-secondary hover:bg-tv-hover hover:text-white border border-tv-border',
            ].join(' ')}
          >
            {category}
          </button>
        ))}
      </nav>

      {/* Grid de videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_VIDEOS.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* Mensaje de más contenido */}
      <div className="mt-12 text-center">
        <p className="text-text-muted mb-4">
          Mais vídeos em breve
        </p>
        <Link
          href="/"
          className={[
            'inline-flex items-center gap-2 px-6 py-3',
            'bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl',
            'transition-colors',
          ].join(' ')}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Assistir ao vivo
        </Link>
      </div>
    </main>
  );
}
