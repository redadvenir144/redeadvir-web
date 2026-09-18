import Link from 'next/link';
import type { ReactNode } from 'react';
import type { AdminUser } from '@/lib/auth/session';
import { AdminNav } from './AdminNav';

/**
 * Marco del panel: cabecera con el usuario, navegación lateral y contenido.
 */
export function AdminShell({
  user,
  children,
  logoutAction,
}: {
  user: AdminUser;
  children: ReactNode;
  logoutAction: () => Promise<void>;
}) {
  return (
    <div className="min-h-screen bg-paper dark:bg-tv-bg">
      <header className="bg-paper-header dark:bg-tv-card border-b border-paper-border dark:border-tv-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <Link
                href="/admin"
                className="block min-h-11 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
              >
                <span className="font-bold text-gray-900 dark:text-white">
                  REDE ADVIR
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-text-muted">
                  Painel
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center min-h-11 px-3 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
              >
                Ver o site
              </Link>

              <span className="hidden md:block text-sm text-gray-600 dark:text-text-secondary truncate max-w-[16ch]">
                {user.name}
              </span>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center min-h-11 px-3 text-sm font-medium text-gray-700 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <AdminNav role={user.role} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
