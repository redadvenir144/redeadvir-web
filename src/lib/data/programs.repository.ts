import type { Program } from '@/types/content';

/**
 * Contrato del repositorio de programas.
 */
export interface ProgramsRepository {
  /**
   * Lista todos los programas.
   */
  getAll(): Promise<Program[]>;

  /**
   * Obtiene un programa por su slug.
   * Retorna null si no existe.
   */
  getBySlug(slug: string): Promise<Program | null>;
}
