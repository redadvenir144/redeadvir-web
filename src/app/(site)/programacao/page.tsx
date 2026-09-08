import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { scheduleRepository } from '@/lib/data';
import { EmptyState, EmptyContentIcon, Skeleton } from '@/components/ui';
import {
  DateNavigator,
  CurrentProgramCard,
  TimeSlotGroup,
} from '@/features/schedule';
import {
  formatDateAsISODate,
  groupSlotsByPeriod,
  formatAsChannelISO,
} from '@/lib/schedule/time';

export const metadata: Metadata = {
  title: 'Programação | Rede ADVIR',
  description:
    'Confira a grade de programação da Rede ADVIR. Veja o que está no ar agora e o que vem a seguir.',
  openGraph: {
    title: 'Programação | Rede ADVIR',
    description:
      'Confira a grade de programação da Rede ADVIR. Veja o que está no ar agora e o que vem a seguir.',
    type: 'website',
  },
};

interface PageProps {
  searchParams: Promise<{ data?: string }>;
}

/**
 * Skeleton de carga para la programación.
 */
function ScheduleSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-2">
          <Skeleton className="h-11 w-20" />
          <Skeleton className="h-11 w-16" />
          <Skeleton className="h-11 w-20" />
        </div>
        <Skeleton className="h-6 w-48" />
      </div>
      <Skeleton className="h-40 w-full" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

/**
 * Contenido principal de la página de programación.
 */
async function ScheduleContent({ selectedDate }: { selectedDate: string }) {
  // Convertir fecha a ISO con hora para el repositorio
  const dateWithTime = `${selectedDate}T00:00:00-03:00`;
  const slots = await scheduleRepository.getByDate(dateWithTime);

  // Verificar si es hoy para mostrar el programa actual
  const todayIso = formatDateAsISODate(new Date());
  const isToday = selectedDate === todayIso;

  // Encontrar slot en vivo (solo si es hoy)
  const currentSlot = isToday ? slots.find((s) => s.status === 'live') : null;

  // Filtrar el slot actual de los grupos si existe
  const slotsForGroups = currentSlot
    ? slots.filter((s) => s.id !== currentSlot.id)
    : slots;

  // Agrupar por franja horaria
  const groupedSlots = groupSlotsByPeriod(slotsForGroups);

  // Si no hay programación
  if (slots.length === 0) {
    return (
      <EmptyState
        icon={<EmptyContentIcon />}
        title="Sem programação"
        description="Não há programação disponível para este dia."
        action={
          <Link
            href="/"
            className={[
              'inline-flex items-center justify-center gap-2',
              'px-4 py-2.5 min-h-11',
              'bg-brand-600 text-white font-medium rounded-lg',
              'hover:bg-brand-700 active:bg-brand-800',
              'transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
            ].join(' ')}
          >
            Voltar ao início
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Programa en vivo destacado */}
      {currentSlot && (
        <section aria-label="Programa ao vivo">
          <CurrentProgramCard slot={currentSlot} />
        </section>
      )}

      {/* Lista vertical por franja */}
      <div className="space-y-6">
        {Array.from(groupedSlots.entries()).map(([period, periodSlots]) => (
          <TimeSlotGroup key={period} period={period} slots={periodSlots} />
        ))}
      </div>
    </div>
  );
}

export default async function ProgramacaoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const todayIso = formatDateAsISODate(new Date());

  // Usar fecha de query param o hoy
  const selectedDate = params.data || todayIso;

  // Validar formato de fecha (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const validDate = dateRegex.test(selectedDate) ? selectedDate : todayIso;

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
      <header className="mb-6">
        <h1 className="sr-only">Programação da Rede ADVIR</h1>
        <Suspense fallback={<Skeleton className="h-24 w-full" />}>
          <DateNavigator selectedDate={validDate} />
        </Suspense>
      </header>

      <Suspense fallback={<ScheduleSkeleton />}>
        <ScheduleContent selectedDate={validDate} />
      </Suspense>
    </main>
  );
}
