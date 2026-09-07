import type { ScheduleSlot } from '@/types/content';
import { LiveBadge, Card } from '@/components/ui';
import { ProgressBar } from '@/features/live';
import { CHANNEL_TIMEZONE } from '@/lib/config/site';

interface CurrentProgramCardProps {
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
 * Tarjeta destacada del programa actualmente en emisión.
 * Reutiliza el ProgressBar de la feature live.
 */
export function CurrentProgramCard({ slot }: CurrentProgramCardProps) {
  const startTime = formatTime(slot.startTime);
  const endTime = formatTime(slot.endTime);

  return (
    <Card
      className="border-live/30 bg-gradient-to-r from-live/5 to-transparent"
      padding="md"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <LiveBadge />
          <span className="text-sm text-text-muted">
            {startTime} – {endTime}
          </span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-text-primary mb-2">
        {slot.program.title}
      </h2>

      <p className="text-sm text-text-secondary mb-4 line-clamp-2">
        {slot.program.description}
      </p>

      <ProgressBar startTime={slot.startTime} endTime={slot.endTime} />
    </Card>
  );
}
