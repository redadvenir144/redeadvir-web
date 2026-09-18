import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  children,
  padding = 'md',
  hover = false,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={[
        'bg-paper-raised dark:bg-tv-card rounded-xl border border-paper-border dark:border-tv-border',
        hover && 'transition-all duration-300 hover:border-brand-400 hover:shadow-md dark:hover:bg-tv-hover dark:hover:border-brand-600/30 dark:hover:shadow-glow',
        paddingStyles[padding],
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
