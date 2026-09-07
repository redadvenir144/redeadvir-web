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
        'bg-surface/95 backdrop-blur-sm',
        'border-b border-surface-border',
        'transition-all duration-200 motion-reduce:transition-none',
        isScrolled ? 'py-2' : 'py-4',
      ].join(' ')}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </header>
  );
}
