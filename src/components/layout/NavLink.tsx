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

    // AO VIVO comparte destino con Início, pero no es una página: es la
    // llamada a ver el directo. Por eso nunca lleva el estado de "página
    // actual" — si lo llevara, en la portada saldrían dos elementos marcados
    // a la vez y el usuario no sabría en cuál está.
    if (isLive) {
      return (
        <Link
          ref={ref}
          href={href}
          onClick={onClick}
          className={[
            'inline-flex items-center gap-2 px-3 xl:px-4 py-2 rounded-full whitespace-nowrap',
            'min-h-11',
            'font-semibold transition-opacity duration-200 hover:opacity-80',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          ].join(' ')}
        >
          {isChannelLive ? (
            <LiveBadge size="sm" />
          ) : (
            <span className="font-bold text-white/80">
              {label}
            </span>
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
          'inline-flex items-center px-3 xl:px-4 py-2 rounded-full whitespace-nowrap',
          'min-h-11',
          'font-medium transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          // La página actual se marca con el mismo color del hover, sin
          // píldora de fondo. El `font-semibold` la distingue del elemento
          // que solo está bajo el puntero.
          isActive
            ? 'text-brand-300 font-semibold'
            : 'text-white/70 hover:text-brand-300',
        ].join(' ')}
        aria-current={isActive ? 'page' : undefined}
      >
        {label}
      </Link>
    );
  }
);
