'use client';

import { useState, useEffect, type ReactNode } from 'react';

interface HeaderWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper del Header que maneja el estado de scroll.
 * Reduce la altura del header cuando el usuario hace scroll.
 */
export function HeaderWrapper({ children }: HeaderWrapperProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={[
        'sticky top-0 z-50',
        'text-white',
        // La línea de la cabecera es el azul de marca, no un gris:
        // ancla la identidad del canal en la parte de arriba.
        'border-b-2 border-brand-600',
        'transition-all duration-300 motion-reduce:transition-none',
        isScrolled
          ? 'py-3 bg-tv-bg/95 backdrop-blur-md'
          // `bg-gradient-to-b` sólo define background-image: sin
          // `dark:bg-transparent`, el `bg-white/90` seguía pintando el
          // fondo también en tema oscuro y la barra salía gris clara.
          : 'py-4 bg-tv-bg',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {children}
      </div>
    </header>
  );
}
