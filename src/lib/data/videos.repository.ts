import type { Video } from '@/types/content';

/**
 * Contrato del repositorio de vídeos.
 */
export interface VideosRepository {
  /** Lista los vídeos publicados, del más reciente al más antiguo. */
  getAll(): Promise<Video[]>;

  /** Obtiene un vídeo por su slug. Null si no existe o no está publicado. */
  getBySlug(slug: string): Promise<Video | null>;

  /** Lista las categorías que tienen al menos un vídeo publicado. */
  getCategories(): Promise<string[]>;
}
