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
        'transition-all duration-300 motion-reduce:transition-none',
        isScrolled
          ? 'py-3 bg-tv-bg/95 backdrop-blur-md border-b border-tv-border'
          : 'py-4 bg-gradient-to-b from-tv-bg/80 to-transparent',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {children}
      </div>
    </header>
  );
}
