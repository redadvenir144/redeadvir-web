import type { ScheduleSlot } from '@/types/content';
import { Badge } from '@/components/ui';
import { CHANNEL_TIMEZONE } from '@/lib/config/site';

interface ScheduleSlotItemProps {
  slot: ScheduleSlot;
}

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
 * Formatea la duración en minutos a formato legible.
 */
function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

/**
 * Item individual de la lista de programación.
 * Muestra hora, título, categoría y duración.
 */
export function ScheduleSlotItem({ slot }: ScheduleSlotItemProps) {
  const startTime = formatTime(slot.startTime);
  const isPast = slot.status === 'past';

  return (
    <article
      className={[
        'flex gap-3 py-3',
        'border-b border-surface-border last:border-b-0',
        isPast ? 'opacity-60' : '',
      ].join(' ')}
    >
      {/* Hora */}
      <div className="flex-shrink-0 w-14">
        <time
          dateTime={slot.startTime}
          className="text-sm font-semibold text-text-secondary tabular-nums"
        >
          {startTime}
        </time>
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-text-primary truncate">
          {slot.program.title}
        </h3>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <Badge variant="muted">{slot.program.category.name}</Badge>
          <span className="text-xs text-text-muted whitespace-nowrap">
            {formatDuration(slot.program.durationMinutes)}
          </span>
        </div>
      </div>
    </article>
  );
}
