import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout';
import { socialMetadata } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { pagesRepository } from '@/lib/data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Páginas de texto editables desde /admin/paginas.
 *
 * Es una ruta dinámica que solo captura lo que no coincide con una ruta fija:
 * /programacao, /videos y las demás siguen ganando por ser segmentos estáticos.
 */
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await pagesRepository.getBySlug(slug);

  if (!page) {
    return { title: 'Página não encontrada' };
  }

  return {
    title: page.title,
    description: page.description,
    ...socialMetadata({
      title: page.title,
      description: page.description,
      type: 'article',
    }),
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await pagesRepository.getBySlug(slug);

  if (!page) notFound();

  // El cuerpo es texto plano: se separa en párrafos por líneas en blanco.
  const paragraphs = page.body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <main className="max-w-3xl mx-auto px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: page.title }]} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {page.title}
        </h1>
        <p className="text-sm text-gray-600 dark:text-text-muted mt-2">
          Atualizada em{' '}
          <time dateTime={page.updatedAt}>
            {new Date(page.updatedAt).toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </p>
      </header>

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
    </main>
  );
}
