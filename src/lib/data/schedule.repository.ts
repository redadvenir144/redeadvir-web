import type { ScheduleSlot } from '@/types/content';

/**
 * Horario de emisión de un programa.
 */
export interface BroadcastTime {
  /** Hora (0-23) */
  hour: number;
  /** Minuto (0-59) */
  minute: number;
}

/**
 * Contrato del repositorio de programación.
 * La lógica de "qué está en emisión ahora" vive aquí, no en el adaptador.
 */
export interface ScheduleRepository {
  /**
   * Obtiene la grilla completa de un día.
   * @param date ISO 8601 con offset (ej: "2024-01-15T00:00:00-03:00")
   */
  getByDate(date: string): Promise<ScheduleSlot[]>;

  /**
   * Obtiene el bloque actualmente en emisión.
   * Retorna null si no hay nada programado para este momento.
   */
  getCurrentSlot(): Promise<ScheduleSlot | null>;

  /**
   * Obtiene el siguiente bloque programado después del actual.
   * Retorna null si no hay más programación hoy.
   */
  getNextSlot(): Promise<ScheduleSlot | null>;

  /**
   * Obtiene los horarios de emisión de un programa por su slug.
   * Como la programación es idéntica todos los días, retorna solo hora:minuto.
   */
  getBroadcastTimesForProgram(programSlug: string): Promise<BroadcastTime[]>;

  /**
   * Verifica si un programa está en emisión ahora.
   */
  isProgramLiveNow(programSlug: string): Promise<boolean>;
}
