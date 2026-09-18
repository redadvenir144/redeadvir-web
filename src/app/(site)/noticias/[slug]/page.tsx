import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { newsRepository } from '@/lib/data';
import { socialMetadata, JsonLd, graph } from '@/lib/seo';
import { Badge } from '@/components/ui';
import { SITE_NAME, SITE_URL } from '@/lib/config/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await newsRepository.getBySlug(slug);

  if (!article) {
    return { title: 'Notícia não encontrada' };
  }

  return {
    title: article.title,
    description: article.excerpt,
    ...socialMetadata({
      title: article.title,
      description: article.excerpt,
      type: 'article',
    }),
  };
}

export default async function NoticiaPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await newsRepository.getBySlug(slug);

  if (!article) notFound();

  const paragraphs = article.body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const publishedLabel = new Date(article.publishedAt).toLocaleDateString(
    'pt-BR',
    { day: 'numeric', month: 'long', year: 'numeric' },
  );

  return (
    <>
      <JsonLd
        data={graph({
          '@type': 'NewsArticle',
          headline: article.title,
          description: article.excerpt,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          ...(article.author
            ? { author: { '@type': 'Person', name: article.author } }
            : {}),
          publisher: { '@id': `${SITE_URL}/#organization` },
          image: article.thumbnail?.src
            ? [article.thumbnail.src]
            : [`${SITE_URL}/images/og-image.jpg`],
          inLanguage: 'pt-BR',
        })}
      />

      <main className="max-w-3xl mx-auto px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { label: 'Notícias', href: '/noticias' },
            { label: article.title },
          ]}
        />

        <header className="mb-6">
          {article.category && (
            <span className="inline-block mb-3">
              <Badge variant="muted">{article.category.name}</Badge>
            </span>
          )}

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {article.title}
          </h1>

          <p className="mt-3 text-sm text-gray-600 dark:text-text-muted">
            <time dateTime={article.publishedAt}>{publishedLabel}</time>
            {article.author && <> · {article.author}</>}
          </p>
        </header>

        {article.thumbnail && (
          <Image
            src={article.thumbnail.src}
            alt={article.thumbnail.alt}
            width={article.thumbnail.width}
            height={article.thumbnail.height}
            className="w-full h-auto rounded-xl mb-6"
            priority
          />
        )}

        {article.excerpt && (
          <p className="text-lg leading-relaxed text-gray-700 dark:text-text-secondary mb-6">
            {article.excerpt}
          </p>
        )}

        <div className="flex flex-col gap-4">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base leading-relaxed text-gray-700 dark:text-text-secondary whitespace-pre-line"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <footer className="mt-10 pt-6 border-t border-paper-border dark:border-tv-border">
          <p className="text-sm text-gray-600 dark:text-text-muted">
            {SITE_NAME}
          </p>
        </footer>
      </main>
    </>
  );
}
