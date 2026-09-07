/**
 * Grilla de programación base (sin status, que se calcula en el repositorio).
 * Según cliente: la programación es idéntica los 7 días.
 *
 * Formato: { programSlug, startHour, startMinute, durationMinutes }
 * El repositorio construye los ScheduleSlot con fechas absolutas.
 */

export interface RawScheduleSlot {
  id: string;
  programSlug: string;
  /** Hora de inicio (0-23) */
  startHour: number;
  /** Minuto de inicio (0-59) */
  startMinute: number;
  /** Duración en minutos */
  durationMinutes: number;
}

// MOCK: horarios inventados, reemplazar con los reales del canal
export const dailySchedule: RawScheduleSlot[] = [
  { id: 'slot-1', programSlug: 'fonte-de-agua-viva', startHour: 6, startMinute: 0, durationMinutes: 30 },
  { id: 'slot-2', programSlug: 'momentos-de-paz', startHour: 6, startMinute: 30, durationMinutes: 15 },
  { id: 'slot-3', programSlug: 'louvores-ao-rei', startHour: 6, startMinute: 45, durationMinutes: 30 },
  { id: 'slot-4', programSlug: 'verdades-para-hoje', startHour: 7, startMinute: 15, durationMinutes: 30 },
  { id: 'slot-5', programSlug: 'cozinha-saudavel', startHour: 7, startMinute: 45, durationMinutes: 30 },
  { id: 'slot-6', programSlug: 'criancas', startHour: 8, startMinute: 15, durationMinutes: 30 },
  { id: 'slot-7', programSlug: 'documentarios', startHour: 8, startMinute: 45, durationMinutes: 60 },
  { id: 'slot-8', programSlug: 'filmes', startHour: 9, startMinute: 45, durationMinutes: 120 },
  { id: 'slot-9', programSlug: 'momentos-de-paz', startHour: 11, startMinute: 45, durationMinutes: 15 },
  { id: 'slot-10', programSlug: 'fonte-de-agua-viva', startHour: 12, startMinute: 0, durationMinutes: 30 },
  { id: 'slot-11', programSlug: 'louvores-ao-rei', startHour: 12, startMinute: 30, durationMinutes: 30 },
  { id: 'slot-12', programSlug: 'verdades-para-hoje', startHour: 13, startMinute: 0, durationMinutes: 30 },
  { id: 'slot-13', programSlug: 'cozinha-saudavel', startHour: 13, startMinute: 30, durationMinutes: 30 },
  { id: 'slot-14', programSlug: 'documentarios', startHour: 14, startMinute: 0, durationMinutes: 60 },
  { id: 'slot-15', programSlug: 'criancas', startHour: 15, startMinute: 0, durationMinutes: 30 },
  { id: 'slot-16', programSlug: 'filmes', startHour: 15, startMinute: 30, durationMinutes: 120 },
  { id: 'slot-17', programSlug: 'momentos-de-paz', startHour: 17, startMinute: 30, durationMinutes: 15 },
  { id: 'slot-18', programSlug: 'louvores-ao-rei', startHour: 17, startMinute: 45, durationMinutes: 30 },
  { id: 'slot-19', programSlug: 'verdades-para-hoje', startHour: 18, startMinute: 15, durationMinutes: 30 },
  { id: 'slot-20', programSlug: 'fonte-de-agua-viva', startHour: 18, startMinute: 45, durationMinutes: 30 },
  { id: 'slot-21', programSlug: 'documentarios', startHour: 19, startMinute: 15, durationMinutes: 60 },
  { id: 'slot-22', programSlug: 'filmes', startHour: 20, startMinute: 15, durationMinutes: 120 },
  { id: 'slot-23', programSlug: 'momentos-de-paz', startHour: 22, startMinute: 15, durationMinutes: 15 },
  { id: 'slot-24', programSlug: 'louvores-ao-rei', startHour: 22, startMinute: 30, durationMinutes: 30 },
];
