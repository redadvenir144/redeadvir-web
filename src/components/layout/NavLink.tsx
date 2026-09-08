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
            'inline-flex items-center gap-2 px-3 py-2 rounded-lg',
            'min-h-11 min-w-11',
            'font-semibold transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-700',
            isActive
              ? 'text-white border-b-2 border-white'
              : 'text-white/80 hover:text-white',
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
          'inline-flex items-center px-3 py-2 rounded-lg',
          'min-h-11 min-w-11',
          'font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-700',
          isActive
            ? 'text-white border-b-2 border-white'
            : 'text-white/80 hover:text-white',
        ].join(' ')}
        aria-current={isActive ? 'page' : undefined}
      >
        {label}
      </Link>
    );
  }
);
