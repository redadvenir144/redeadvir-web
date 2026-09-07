import type { HTMLAttributes } from 'react';

interface LiveBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Tamaño del badge */
  size?: 'sm' | 'md';
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

const dotSizeStyles = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
};

/**
 * Badge exclusivo para estado en directo.
 * El color rojo está reservado únicamente para este componente.
 * Incluye punto pulsante que respeta prefers-reduced-motion.
 */
export function LiveBadge({
  size = 'md',
  className = '',
  ...props
}: LiveBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5',
        'bg-live text-white font-semibold rounded-full',
        sizeStyles[size],
        className,
      ].join(' ')}
      role="status"
      aria-live="polite"
      {...props}
    >
      <span
        className={[
          'rounded-full bg-white',
          'motion-safe:animate-pulse-live',
          dotSizeStyles[size],
        ].join(' ')}
        aria-hidden="true"
      />
      AO VIVO
    </span>
  );
}
