import Link from 'next/link';
import { scheduleRepository } from '@/lib/data';
import { EmptyState, EmptyContentIcon } from '@/components/ui';
import { ScheduleSlotItem } from './ScheduleSlotItem';
import { formatDateAsISODate, addDaysToDate } from '@/lib/schedule/time';
import type { ScheduleSlot } from '@/types/content';

/** Cuántos bloques se muestran en la vista previa de la home. */
const PREVIEW_LIMIT = 6;

function ArrowRightIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

/**
 * Lista de programación para la home.
 *
 * Muestra lo que queda del día y, si ya no llega a `PREVIEW_LIMIT`, encadena
 * con la madrugada del día siguiente. Sin eso, a las 22:00 la lista se
 * quedaba en dos bloques y la sección perdía sentido justo en el horario de
 * mayor audiencia.
 */
export async function ScheduleListPreview() {
  const today = formatDateAsISODate(new Date());
  const todaySlots = await scheduleRepository.getByDate(
    `${today}T00:00:00-03:00`,
  );

  const remaining = todaySlots.filter((slot) => slot.status !== 'past');

  let visibleSlots: ScheduleSlot[] = remaining.slice(0, PREVIEW_LIMIT);
  let tomorrowFrom = -1;

  if (visibleSlots.length < PREVIEW_LIMIT) {
    const tomorrow = addDaysToDate(today, 1);
    const tomorrowSlots = await scheduleRepository.getByDate(
      `${tomorrow}T00:00:00-03:00`,
    );
    const needed = PREVIEW_LIMIT - visibleSlots.length;
    const extra = tomorrowSlots.slice(0, needed);

    if (extra.length > 0) {
      tomorrowFrom = visibleSlots.length;
      visibleSlots = [...visibleSlots, ...extra];
    }
  }

  return (
    <section
      // Sin separación arriba, el título quedaba pegado a la tarjeta
      // de "Agora" que va justo encima.
      className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 sm:pt-14 pb-10"
      aria-labelledby="home-schedule-title"
    >
      <header className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h2
            id="home-schedule-title"
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            Programação
          </h2>
          <p className="text-gray-600 dark:text-text-secondary mt-1">
            O que vem a seguir na REDE ADVIR
          </p>
        </div>

        <Link
          href="/programacao"
          className={[
            'hidden sm:inline-flex items-center gap-1',
            'min-h-11 px-1',
            'text-sm font-semibold text-brand-700 dark:text-brand-400',
            'hover:underline',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded',
          ].join(' ')}
        >
          Ver grade completa
          <ArrowRightIcon />
        </Link>
      </header>

      {visibleSlots.length === 0 ? (
        <EmptyState
          icon={<EmptyContentIcon />}
          title="Sem programação"
          description="Não há programação disponível no momento."
          action={
            <Link
              href="/programacao"
              className={[
                'inline-flex items-center justify-center gap-2',
                'px-4 py-2.5 min-h-11',
                'bg-brand-600 text-white font-medium rounded-lg',
                'hover:bg-brand-700 active:bg-brand-800',
                'transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
              ].join(' ')}
            >
              Ver programação
            </Link>
          }
        />
      ) : (
        <>
          <div
            className={[
              'rounded-xl px-4',
              'bg-paper-raised dark:bg-tv-card',
              'border border-paper-border dark:border-tv-border',
            ].join(' ')}
          >
            {visibleSlots.map((slot, index) => (
              <div key={slot.id}>
                {index === tomorrowFrom && (
                  <p className="pt-4 pb-1 text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-text-muted">
                    Amanhã
                  </p>
                )}
                <ScheduleSlotItem slot={slot} />
              </div>
            ))}
          </div>

          {/* En móvil el enlace va abajo, como CTA de ancho completo */}
          <Link
            href="/programacao"
            className={[
              'sm:hidden mt-4',
              'flex items-center justify-center gap-2',
              'px-4 py-3 min-h-11 w-full',
              'bg-brand-600 text-white font-semibold rounded-lg',
              'hover:bg-brand-700 active:bg-brand-800',
              'transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            ].join(' ')}
          >
            Ver grade completa
            <ArrowRightIcon />
          </Link>
        </>
      )}
    </section>
  );
}
