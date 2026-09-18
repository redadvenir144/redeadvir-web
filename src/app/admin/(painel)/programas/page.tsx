import { requireUser } from '@/lib/auth/guard';
import { listPrograms, listCategories } from '@/lib/admin/queries';
import { ProgramsManager } from './ProgramsManager';

export default async function ProgramasPage() {
  await requireUser();

  const [programs, categories] = await Promise.all([
    listPrograms(),
    listCategories(),
  ]);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Programas
        </h1>
        <p className="text-gray-600 dark:text-text-secondary mt-1">
          Cadastre os programas antes de montar a grade.
        </p>
      </header>

      <ProgramsManager programs={programs} categories={categories} />
    </>
  );
}
