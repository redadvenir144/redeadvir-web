'use client';

import { useState, useEffect } from 'react';

interface ProgressBarProps {
  /** ISO 8601 con offset */
  startTime: string;
  /** ISO 8601 con offset */
  endTime: string;
}

/**
 * Calcula el porcentaje de progreso entre dos tiempos.
 */
function calculateProgress(startTime: string, endTime: string): number {
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (now <= start) return 0;
  if (now >= end) return 100;

  const total = end - start;
  const elapsed = now - start;
  return Math.round((elapsed / total) * 100);
}

/**
 * Barra de progreso del tiempo transcurrido.
 * Se actualiza cada 30 segundos.
 */
export function ProgressBar({ startTime, endTime }: ProgressBarProps) {
  const [progress, setProgress] = useState(() =>
    calculateProgress(startTime, endTime)
  );

  useEffect(() => {
    // Actualizar inmediatamente
    setProgress(calculateProgress(startTime, endTime));

    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      setProgress(calculateProgress(startTime, endTime));
    }, 30_000);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  return (
    <div
      className="h-1.5 bg-surface-muted rounded-full overflow-hidden"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${progress}% do programa concluído`}
    >
      <div
        className="h-full bg-brand-600 rounded-full transition-all duration-500 motion-reduce:transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
