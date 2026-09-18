import type { ReactNode, HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'brand' | 'muted';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700 dark:bg-tv-elevated dark:text-text-secondary',
  brand: 'bg-brand-100 text-brand-800 dark:bg-brand-600/20 dark:text-brand-300',
  muted: 'bg-gray-100 text-gray-600 dark:bg-tv-border dark:text-text-secondary',
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
