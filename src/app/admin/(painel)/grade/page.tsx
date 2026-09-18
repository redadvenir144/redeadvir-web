import { Suspense } from 'react';
import { requireUser } from '@/lib/auth/guard';
import { listSlotsByDay, listPrograms } from '@/lib/admin/queries';
import { ScheduleManager } from './ScheduleManager';
import type { DayOfWeek } from '@/types/content';

interface PageProps {
  searchParams: Promise<{ dia?: string }>;
}

/** Día pedido por query, o el de hoy si no viene o no es válido. */
function resolveDay(raw: string | undefined): DayOfWeek {
  const parsed = Number.parseInt(raw ?? '', 10);
  if (Number.isInteger(parsed) && parsed >= 0 && parsed <= 6) {
    return parsed as DayOfWeek;
  }
  return new Date().getDay() as DayOfWeek;
}

async function GradeContent({ day }: { day: DayOfWeek }) {
  const [slots, programs] = await Promise.all([
    listSlotsByDay(day),
    listPrograms(),
  ]);

  return <ScheduleManager day={day} slots={slots} programs={programs} />;
}

export default async function GradePage({ searchParams }: PageProps) {
  await requireUser();
  const params = await searchParams;
  const day = resolveDay(params.dia);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Grade de programação
        </h1>
        <p className="text-gray-600 dark:text-text-secondary mt-1">
          A grade é montada por dia da semana e se repete toda semana.
        </p>
      </header>

      <Suspense fallback={<p className="text-sm text-gray-500">Carregando…</p>}>
        <GradeContent day={day} />
      </Suspense>
    </>
  );
}
