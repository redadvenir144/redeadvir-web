'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/config/site';
import { LiveBadge } from '@/components/ui';
import { ThemeToggle } from '@/components/theme';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  /** Si el canal está emitiendo */
  isChannelLive?: boolean;
}

/**
 * Menú móvil accesible.
 * - Foco atrapado mientras está abierto
 * - Cierre con Escape
 * - Devuelve el foco al botón que lo abrió
 */
export function MobileMenu({
  isOpen,
  onClose,
  menuId,
  triggerRef,
  isChannelLive = false,
}: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();

  // Manejar cierre con Escape
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Focus trap
  const handleFocusTrap = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !menuRef.current) return;

      const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    },
    []
  );

  // Efectos para accesibilidad
  useEffect(() => {
    if (!isOpen) return;

    // Agregar listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleFocusTrap);

    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';

    // Mover foco al primer elemento
    const timer = setTimeout(() => {
      firstLinkRef.current?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleFocusTrap);
      document.body.style.overflow = '';
      clearTimeout(timer);

      // Devolver foco al trigger
      triggerRef.current?.focus();
    };
  }, [isOpen, handleKeyDown, handleFocusTrap, triggerRef]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel del menú */}
      <div
        ref={menuRef}
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={[
          'fixed inset-x-0 top-0 z-50 md:hidden',
          'bg-white dark:bg-tv-card',
          'shadow-xl',
          'max-h-screen overflow-y-auto',
        ].join(' ')}
      >
        {/* Header del menú */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-tv-border">
          <span className="font-bold text-lg text-gray-900 dark:text-white">Menu</span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
            type="button"
            onClick={onClose}
            className={[
              'inline-flex items-center justify-center',
              'min-h-11 min-w-11 p-2',
              'rounded-lg',
              'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-tv-hover',
              'transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
            ].join(' ')}
            aria-label="Fechar menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            </button>
          </div>
        </div>

        {/* Navegación */}
        <nav className="p-4" aria-label="Navegação principal">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item, index) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    onClick={onClose}
                    className={[
                      'flex items-center gap-2 px-3 py-3 rounded-lg',
                      'min-h-11',
                      'font-medium transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
                      isActive
                        ? 'bg-brand-100 dark:bg-brand-600/20 text-brand-700 dark:text-brand-400'
                        : 'text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-tv-hover',
                      item.isLive && 'font-semibold',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.isLive ? (
                      isChannelLive ? (
                        <LiveBadge size="sm" />
                      ) : (
                        <span className="text-brand-600 dark:text-brand-400 font-bold">
                          {item.label}
                        </span>
                      )
                    ) : (
                      item.label
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Botón Doar */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-tv-border">
            <Link
              href="/doar"
              onClick={onClose}
              className={[
                'flex items-center justify-center gap-2 px-4 py-3 rounded-xl',
                'bg-brand-600 hover:bg-brand-500 text-white font-semibold',
                'transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2',
              ].join(' ')}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              Doar
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
