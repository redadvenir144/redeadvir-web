import Link from 'next/link';
import type { Program } from '@/types/content';
import type { BroadcastTime } from '@/lib/data/schedule.repository';
import { Card, Badge, LiveBadge } from '@/components/ui';
import { ProgramImage } from './ProgramImage';

interface ProgramCardProps {
  program: Program;
  broadcastTimes: BroadcastTime[];
  isLive?: boolean;
}

/**
 * Formatea un horario de emisión.
 */
function formatTime(time: BroadcastTime): string {
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
}

/**
 * Tarjeta de programa para el grid de /programas.
 */
export function ProgramCard({ program, broadcastTimes, isLive = false }: ProgramCardProps) {
  return (
    <Card padding="none" className="overflow-hidden group">
      <Link
        href={`/programas/${program.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-inset"
      >
        {/* Imagen */}
        <div className="relative">
          <ProgramImage title={program.title} size="md" />
          {isLive && (
            <div className="absolute top-2 left-2">
              <LiveBadge />
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="font-semibold text-text-primary group-hover:text-brand-600 transition-colors line-clamp-1">
              {program.title}
            </h2>
            <Badge variant="muted" className="flex-shrink-0">
              {program.category.name}
            </Badge>
          </div>

          <p className="text-sm text-text-secondary line-clamp-2 mb-3">
            {program.description}
          </p>

          {/* Horarios */}
          {broadcastTimes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {broadcastTimes.map((time, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-0.5 text-xs font-medium text-text-muted bg-surface-muted rounded"
                >
                  {formatTime(time)}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
}
