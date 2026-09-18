import type { ReactNode } from 'react';

/**
 * Bloque blanco con título. La unidad visual de todo el panel.
 */
export function Panel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="bg-paper-raised dark:bg-tv-card border border-paper-border dark:border-tv-border rounded-xl overflow-hidden mb-6">
      <header className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 border-b border-paper-border dark:border-tv-border">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-gray-600 dark:text-text-secondary mt-0.5">
              {description}
            </p>
          )}
        </div>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

/**
 * Aviso cuando una lista está vacía.
 */
export function EmptyRow({ children }: { children: ReactNode }) {
  return (
    <p className="py-6 text-center text-sm text-gray-500 dark:text-text-muted">
      {children}
    </p>
  );
}
