import type { Article } from '@/types/content';

/**
 * Contrato del repositorio de notícias.
 */
export interface NewsRepository {
  /** Lista las notícias publicadas, de la más reciente a la más antigua. */
  getAll(limit?: number): Promise<Article[]>;

  /** Obtiene una notícia por su slug. Null si no existe o no está publicada. */
  getBySlug(slug: string): Promise<Article | null>;
}
