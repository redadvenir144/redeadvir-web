import Link from 'next/link';
import { scheduleRepository } from '@/lib/data';
import { EmptyState, EmptyContentIcon } from '@/components/ui';
import { ProgressBar } from './ProgressBar';
import { CHANNEL_TIMEZONE } from '@/lib/config/site';

/**
 * Formatea una hora ISO a formato legible (HH:MM).
 */
function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: CHANNEL_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return formatter.format(date);
}

/**
 * Barra de programación actual y siguiente.
 * Server Component que consume el repositorio de schedule.
 */
export async function NowNextBar() {
  const [currentSlot, nextSlot] = await Promise.all([
    scheduleRepository.getCurrentSlot(),
    scheduleRepository.getNextSlot(),
  ]);

  // Si no hay franja actual, mostrar EmptyState
  if (!currentSlot) {
    return (
      <section
        className="bg-surface border border-surface-border rounded-lg"
        aria-labelledby="schedule-empty-title"
      >
        <EmptyState
          icon={<EmptyContentIcon />}
          title="Fora da programação"
          description="Não há nenhum programa no ar neste momento. Confira a grade completa."
          action={
            <Link
              href="/programacao"
              className={[
                'inline-flex items-center justify-center gap-2',
                'px-4 py-2.5 min-h-11 min-w-11',
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
      </section>
    );
  }

  const startTime = formatTime(currentSlot.startTime);
  const endTime = formatTime(currentSlot.endTime);

  return (
    <section
      className="bg-surface border border-surface-border rounded-lg p-4"
      aria-label="Programação atual"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {/* Bloque AGORA */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">
              Agora
            </span>
            <span className="text-xs text-text-muted">
              {startTime} – {endTime}
            </span>
          </div>

          <h2 className="text-lg font-semibold text-text-primary truncate mb-3">
            {currentSlot.program.title}
          </h2>

          <ProgressBar
            startTime={currentSlot.startTime}
            endTime={currentSlot.endTime}
          />
        </div>

        {/* Bloque A SEGUIR (solo si existe) */}
        {nextSlot && (
          <div className="md:text-right md:flex-shrink-0 md:ml-6 pt-2 md:pt-0 border-t border-surface-border md:border-t-0">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wide">
              A seguir
            </span>
            <p className="text-sm text-text-secondary mt-1">
              <span className="font-medium">{formatTime(nextSlot.startTime)}</span>
              {' · '}
              <span>{nextSlot.program.title}</span>
            </p>
          </div>
        )}
      </div>

      {/* Enlace a programación completa */}
      <div className="mt-4 pt-3 border-t border-surface-border">
        <Link
          href="/programacao"
          className={[
            'inline-flex items-center gap-1',
            'text-sm font-medium text-brand-600',
            'hover:text-brand-700 hover:underline',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
            'min-h-11 min-w-11',
          ].join(' ')}
        >
          Ver programação completa
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
