import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Variante visual */
  variant?: 'text' | 'rectangular' | 'circular';
  /** Ancho (cualquier valor CSS válido) */
  width?: string;
  /** Alto (cualquier valor CSS válido) */
  height?: string;
}

const variantStyles = {
  text: 'rounded',
  rectangular: 'rounded-lg',
  circular: 'rounded-full',
};

/**
 * Placeholder animado para contenido en carga.
 * Respeta prefers-reduced-motion.
 */
export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={[
        'bg-surface-muted',
        'motion-safe:animate-pulse',
        variantStyles[variant],
        className,
      ].join(' ')}
      style={{
        width: width ?? (variant === 'text' ? '100%' : undefined),
        height: height ?? (variant === 'text' ? '1em' : undefined),
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}
