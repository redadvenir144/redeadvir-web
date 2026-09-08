'use client';

import { useState, useRef, useCallback } from 'react';
import { Logo } from './Logo';
import { DesktopNav } from './DesktopNav';
import { MobileMenu } from './MobileMenu';
import { HeaderWrapper } from './HeaderWrapper';

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
          <DesktopNav isChannelLive={isChannelLive} />

          {/* Mobile menu button */}
          <button
            ref={mobileMenuButtonRef}
            type="button"
            onClick={toggleMenu}
            className={[
              'md:hidden',
              'inline-flex items-center justify-center',
              'min-h-11 min-w-11 p-2',
              'rounded-lg',
              'text-white hover:bg-white/10',
              'transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-700',
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
