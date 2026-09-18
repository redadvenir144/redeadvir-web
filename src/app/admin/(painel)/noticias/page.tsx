import { requireUser } from '@/lib/auth/guard';
import { listArticles, listCategories } from '@/lib/admin/queries';
import { NewsManager } from './NewsManager';

export default async function NoticiasAdminPage() {
  await requireUser();

  const [articles, categories] = await Promise.all([
    listArticles(),
    listCategories(),
  ]);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notícias
        </h1>
        <p className="text-gray-600 dark:text-text-secondary mt-1">
          Só as marcadas como publicadas aparecem no site.
        </p>
      </header>

      <NewsManager articles={articles} categories={categories} />
    </>
  );
}
