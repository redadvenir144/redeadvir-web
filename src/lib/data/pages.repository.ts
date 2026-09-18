import type { Page } from '@/types/content';

/**
 * Contrato del repositorio de páginas de texto.
 */
export interface PagesRepository {
  /** Obtiene una página por su slug. Null si no existe o no está publicada. */
  getBySlug(slug: string): Promise<Page | null>;

  /** Lista todas las páginas publicadas. */
  getAll(): Promise<Page[]>;
}
