'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AdminRole } from '@/lib/auth/session';

interface NavItem {
  href: string;
  label: string;
  /** Solo visible para el rol admin. */
  adminOnly?: boolean;
}

const ITEMS: NavItem[] = [
  { href: '/admin', label: 'Início' },
  { href: '/admin/programas', label: 'Programas' },
  { href: '/admin/grade', label: 'Grade' },
  { href: '/admin/videos', label: 'Vídeos' },
  { href: '/admin/noticias', label: 'Notícias' },
  { href: '/admin/paginas', label: 'Páginas' },
  { href: '/admin/configuracao', label: 'Configuração' },
  { href: '/admin/usuarios', label: 'Usuários', adminOnly: true },
];

export function AdminNav({ role }: { role: AdminRole }) {
  const pathname = usePathname();
  const items = ITEMS.filter((item) => !item.adminOnly || role === 'admin');

  return (
    <nav
      aria-label="Seções do painel"
      className="lg:w-56 lg:flex-shrink-0"
    >
      <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        {items.map((item) => {
          // "/admin" solo está activo en su ruta exacta; el resto acepta subrutas.
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <li key={item.href} className="flex-shrink-0">
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'flex items-center min-h-11 px-4 rounded-lg whitespace-nowrap',
                  'text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-tv-hover hover:text-gray-900 dark:hover:text-white',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                ].join(' ')}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
