import type { ReactNode, HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'brand' | 'muted';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-muted text-text-secondary',
  brand: 'bg-brand-100 text-brand-700',
  muted: 'bg-surface-subtle text-text-muted',
};

export function Badge({
  variant = 'default',
  children,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5',
        'text-xs font-medium rounded-full',
        variantStyles[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  );
}
