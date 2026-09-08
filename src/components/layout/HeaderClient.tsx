'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { DesktopNav } from './DesktopNav';
import { MobileMenu } from './MobileMenu';
import { HeaderWrapper } from './HeaderWrapper';

function HeartIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

const MOBILE_MENU_ID = 'mobile-menu';

interface HeaderClientProps {
  /** Si el canal está emitiendo (viene del servidor) */
  isChannelLive?: boolean;
}

/**
 * Client Component del Header que maneja el estado del menú móvil.
 */
export function HeaderClient({ isChannelLive = false }: HeaderClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <HeaderWrapper>
        <div className="flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-4">
            <DesktopNav isChannelLive={isChannelLive} />

            {/* Botón Doar - Desktop */}
            <Link
              href="/doar"
              className={[
                'hidden md:inline-flex items-center gap-2',
                'px-4 py-2 rounded-full',
                'bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm',
                'transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-tv-bg',
              ].join(' ')}
            >
              <HeartIcon />
              Doar
            </Link>

            {/* Mobile menu button */}
            <button
              ref={mobileMenuButtonRef}
              type="button"
              onClick={toggleMenu}
              className={[
                'md:hidden',
                'inline-flex items-center justify-center',
                'min-h-11 min-w-11 p-2',
                'rounded-full',
                'text-white/70 hover:text-white hover:bg-white/10',
                'transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-tv-bg',
              ].join(' ')}
              aria-expanded={isMobileMenuOpen}
              aria-controls={MOBILE_MENU_ID}
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </HeaderWrapper>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMenu}
        menuId={MOBILE_MENU_ID}
        triggerRef={mobileMenuButtonRef}
        isChannelLive={isChannelLive}
      />
    </>
  );
}
