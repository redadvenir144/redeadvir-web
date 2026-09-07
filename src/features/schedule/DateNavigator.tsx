'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { CHANNEL_TIMEZONE } from '@/lib/config/site';
import { addDaysToDate, formatDateAsISODate } from '@/lib/schedule/time';

interface DateNavigatorProps {
  /** Fecha actual seleccionada en formato ISO (YYYY-MM-DD) */
  selectedDate: string;
}

/**
 * Formatea una fecha para mostrar en formato legible pt-BR.
 */
function formatDisplayDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: CHANNEL_TIMEZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return formatter.format(date);
}

/**
 * Verifica si una fecha ISO es hoy en la zona horaria del canal.
 */
function isToday(isoDate: string): boolean {
  const todayIso = formatDateAsISODate(new Date());
  return isoDate === todayIso;
}

/**
 * Navegador de fechas con botones Ontem/Hoje/Amanhã.
 */
export function DateNavigator({ selectedDate }: DateNavigatorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const todayIso = useMemo(() => formatDateAsISODate(new Date()), []);
  const yesterdayIso = useMemo(() => addDaysToDate(selectedDate, -1), [selectedDate]);
  const tomorrowIso = useMemo(() => addDaysToDate(selectedDate, 1), [selectedDate]);

  const navigateToDate = useCallback(
    (date: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (date === todayIso) {
        params.delete('data');
      } else {
        params.set('data', date);
      }
      const queryString = params.toString();
      router.push(`/programacao${queryString ? `?${queryString}` : ''}`);
    },
    [router, searchParams, todayIso]
  );

  const displayDate = formatDisplayDate(selectedDate);
  const isSelectedToday = isToday(selectedDate);

  return (
    <nav
      className="flex flex-col gap-3"
      aria-label="Navegação de datas"
    >
      {/* Botones de navegación */}
      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => navigateToDate(yesterdayIso)}
          className={[
            'flex items-center gap-1 px-3 py-2 min-h-11 min-w-11',
            'text-sm font-medium rounded-lg',
            'transition-colors',
            'text-text-secondary hover:text-text-primary hover:bg-surface-muted',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
          ].join(' ')}
          aria-label="Ver programação de ontem"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Ontem</span>
        </button>

        <button
          type="button"
          onClick={() => navigateToDate(todayIso)}
          className={[
            'px-4 py-2 min-h-11',
            'text-sm font-bold uppercase tracking-wide rounded-lg',
            'transition-colors',
            isSelectedToday
              ? 'bg-brand-600 text-white'
              : 'bg-surface-muted text-brand-600 hover:bg-brand-100',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
          ].join(' ')}
          aria-current={isSelectedToday ? 'date' : undefined}
        >
          Hoje
        </button>

        <button
          type="button"
          onClick={() => navigateToDate(tomorrowIso)}
          className={[
            'flex items-center gap-1 px-3 py-2 min-h-11 min-w-11',
            'text-sm font-medium rounded-lg',
            'transition-colors',
            'text-text-secondary hover:text-text-primary hover:bg-surface-muted',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
          ].join(' ')}
          aria-label="Ver programação de amanhã"
        >
          <span className="hidden sm:inline">Amanhã</span>
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
        </button>
      </div>

      {/* Fecha completa */}
      <p className="text-center text-lg font-semibold text-text-primary capitalize">
        {displayDate}
      </p>
    </nav>
  );
}
