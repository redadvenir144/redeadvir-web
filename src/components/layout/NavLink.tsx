'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LiveBadge } from '@/components/ui';

interface NavLinkProps {
  href: string;
  label: string;
  isLive?: boolean;
  /** Si el canal está emitiendo (para mostrar LiveBadge) */
  isChannelLive?: boolean;
  onClick?: () => void;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  function NavLink(
    { href, label, isLive = false, isChannelLive = false, onClick },
    ref
  ) {
    const pathname = usePathname();
    const isActive = pathname === href;

    if (isLive) {
      return (
        <Link
          ref={ref}
          href={href}
          onClick={onClick}
          className={[
            'inline-flex items-center gap-2 px-4 py-2 rounded-full',
            'min-h-11',
            'font-semibold transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            isActive
              ? 'text-brand-700 dark:text-white bg-brand-100 dark:bg-white/10'
              : 'text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5',
          ].join(' ')}
          aria-current={isActive ? 'page' : undefined}
        >
          {isChannelLive ? (
            <LiveBadge size="sm" />
          ) : (
            <span className="font-bold">{label}</span>
          )}
        </Link>
      );
    }

    return (
      <Link
        ref={ref}
        href={href}
        onClick={onClick}
        className={[
          'inline-flex items-center px-4 py-2 rounded-full',
          'min-h-11',
          'font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          isActive
            ? 'text-brand-700 dark:text-white bg-brand-100 dark:bg-white/10'
            : 'text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5',
        ].join(' ')}
        aria-current={isActive ? 'page' : undefined}
      >
        {label}
      </Link>
    );
  }
);
