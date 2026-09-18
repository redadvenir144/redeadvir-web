import { requireUser } from '@/lib/auth/guard';
import { listPages } from '@/lib/admin/queries';
import { PagesManager } from './PagesManager';

export default async function PaginasPage() {
  await requireUser();
  const pages = await listPages();

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Páginas
        </h1>
        <p className="text-gray-600 dark:text-text-secondary mt-1">
          Textos institucionais e políticas do site.
        </p>
      </header>

      <PagesManager pages={pages} />
    </>
  );
}
