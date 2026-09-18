import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout';
import Link from 'next/link';
import Image from 'next/image';
import { socialMetadata } from '@/lib/seo';
import { EmptyState, EmptyContentIcon, Badge } from '@/components/ui';
import { newsRepository } from '@/lib/data';
import type { Article } from '@/types/content';

export const metadata: Metadata = {
  title: 'Notícias',
  description:
    'Novidades, avisos e bastidores da REDE ADVIR: o que acontece no canal e na rede de emissoras cristãs.',
  ...socialMetadata({
    title: 'Notícias',
    description:
      'Novidades, avisos e bastidores da REDE ADVIR e da rede de emissoras cristãs.',
  }),
};

/** Se publica desde /admin/noticias, así que no se prerenderiza. */
export const revalidate = 300;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <article>
      <Link
        href={`/noticias/${article.slug}`}
        className={[
          'group flex flex-col h-full overflow-hidden rounded-xl',
          'bg-paper-raised dark:bg-tv-card',
          'border border-paper-border dark:border-tv-border',
          'hover:border-brand-400 hover:shadow-md',
          'dark:hover:bg-tv-hover dark:hover:border-brand-600/40',
          'transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        ].join(' ')}
      >
        <div className="relative aspect-[1200/630] bg-gradient-to-br from-brand-600 to-brand-800">
          {article.thumbnail && (
            <Image
              src={article.thumbnail.src}
              alt={article.thumbnail.alt}
              width={article.thumbnail.width}
              height={article.thumbnail.height}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col flex-1 p-4">
          {article.category && (
            <span className="mb-2">
              <Badge variant="muted">{article.category.name}</Badge>
            </span>
          )}

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
            {article.title}
          </h2>

          {article.excerpt && (
            <p className="mt-2 text-sm text-gray-600 dark:text-text-secondary line-clamp-3">
              {article.excerpt}
            </p>
          )}

          <p className="mt-auto pt-3 text-xs text-gray-600 dark:text-text-muted">
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            {article.author && <> · {article.author}</>}
          </p>
        </div>
      </Link>
    </article>
  );
}

export default async function NoticiasPage() {
  const articles = await newsRepository.getAll();

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Notícias' }]} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Notícias
        </h1>
        <p className="text-gray-600 dark:text-text-secondary">
          Novidades e avisos da REDE ADVIR
        </p>
      </header>

      {articles.length === 0 ? (
        <EmptyState
          icon={<EmptyContentIcon />}
          title="Ainda não há notícias"
          description="Assim que houver novidades, elas aparecem aqui. Enquanto isso, assista à transmissão ao vivo."
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
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
