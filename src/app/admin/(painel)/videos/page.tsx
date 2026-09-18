import { requireUser } from '@/lib/auth/guard';
import { listVideos, listCategories } from '@/lib/admin/queries';
import { VideosManager } from './VideosManager';

export default async function VideosAdminPage() {
  await requireUser();

  const [videos, categories] = await Promise.all([
    listVideos(),
    listCategories(),
  ]);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Vídeos
        </h1>
        <p className="text-gray-600 dark:text-text-secondary mt-1">
          Só os marcados como publicados aparecem no site.
        </p>
      </header>

      <VideosManager videos={videos} categories={categories} />
    </>
  );
}
