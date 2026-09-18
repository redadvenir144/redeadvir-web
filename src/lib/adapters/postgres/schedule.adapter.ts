import 'server-only';
import type { ScheduleSlot, Program } from '@/types/content';
import type {
  ScheduleRepository,
  BroadcastTime,
} from '@/lib/data/schedule.repository';
import { requireSql } from '@/lib/db/client';
import { toProgram, type ProgramRow } from './rows';
import {
  channelTimeToUTC,
  formatAsChannelISO,
  getSlotStatus,
  findCurrentSlot,
  findNextSlot,
  extractDateParts,
  getDatePartsInChannelTimezone,
} from '@/lib/schedule/time';

interface SlotRow extends ProgramRow {
  slot_id: string;
  start_hour: number;
  start_minute: number;
  slot_duration_minutes: number;
}

/**
 * Día de la semana de una fecha de calendario (0 = domingo).
 * Se calcula en UTC a propósito: el año/mes/día ya vienen resueltos en la zona
 * del canal, así que meter otro huso aquí desplazaría el día.
 */
function dayOfWeekFor(year: number, month: number, day: number): number {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export class PostgresScheduleAdapter implements ScheduleRepository {
  private async fetchSlotsForDay(dayOfWeek: number): Promise<SlotRow[]> {
    const sql = requireSql();
    return sql<SlotRow[]>`
      SELECT
        s.id AS slot_id,
        s.start_hour, s.start_minute,
        s.duration_minutes AS slot_duration_minutes,
        p.id, p.slug, p.title, p.description,
        p.category_id, c.slug AS category_slug, c.name AS category_name,
        p.thumbnail_src, p.thumbnail_alt, p.thumbnail_width, p.thumbnail_height,
        p.duration_minutes
      FROM schedule_slots s
      JOIN programs p ON p.id = s.program_id
      JOIN categories c ON c.id = p.category_id
      WHERE s.day_of_week = ${dayOfWeek}
      ORDER BY s.start_hour ASC, s.start_minute ASC
    `;
  }

  /**
   * Convierte los bloques del día de la semana en slots con fecha absoluta.
   * Misma lógica que el adaptador mock, para que cambiar de fuente no cambie
   * el comportamiento de la grilla.
   */
  private buildSlots(
    rows: SlotRow[],
    year: number,
    month: number,
    day: number,
    nowTimestamp: number,
  ): ScheduleSlot[] {
    return rows.map((row) => {
      const startTimestamp = channelTimeToUTC(
        year,
        month,
        day,
        row.start_hour,
        row.start_minute,
      );
      const endTimestamp =
        startTimestamp + row.slot_duration_minutes * 60 * 1000;

      const startTime = formatAsChannelISO(startTimestamp);
      const endTime = formatAsChannelISO(endTimestamp);

      const program: Program = toProgram(row);

      return {
        id: `${row.slot_id}-${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`,
        program,
        startTime,
        endTime,
        status: getSlotStatus(startTime, endTime, nowTimestamp),
      };
    });
  }

  async getByDate(date: string): Promise<ScheduleSlot[]> {
    const { year, month, day } = extractDateParts(date);
    const rows = await this.fetchSlotsForDay(dayOfWeekFor(year, month, day));
    return this.buildSlots(rows, year, month, day, Date.now());
  }

  private async slotsForToday(): Promise<{
    slots: ScheduleSlot[];
    nowTimestamp: number;
  }> {
    const nowTimestamp = Date.now();
    const { year, month, day } = getDatePartsInChannelTimezone(
      new Date(nowTimestamp),
    );
    const rows = await this.fetchSlotsForDay(dayOfWeekFor(year, month, day));
    return {
      slots: this.buildSlots(rows, year, month, day, nowTimestamp),
      nowTimestamp,
    };
  }

  async getCurrentSlot(): Promise<ScheduleSlot | null> {
    const { slots, nowTimestamp } = await this.slotsForToday();
    return findCurrentSlot(slots, nowTimestamp);
  }

  async getNextSlot(): Promise<ScheduleSlot | null> {
    const { slots, nowTimestamp } = await this.slotsForToday();
    return findNextSlot(slots, nowTimestamp);
  }

  async getBroadcastTimesForProgram(
    programSlug: string,
  ): Promise<BroadcastTime[]> {
    const sql = requireSql();
    const rows = await sql<{ start_hour: number; start_minute: number }[]>`
      SELECT DISTINCT s.start_hour, s.start_minute
      FROM schedule_slots s
      JOIN programs p ON p.id = s.program_id
      WHERE p.slug = ${programSlug}
      ORDER BY s.start_hour ASC, s.start_minute ASC
    `;
    return rows.map((row) => ({
      hour: row.start_hour,
      minute: row.start_minute,
    }));
  }

  async isProgramLiveNow(programSlug: string): Promise<boolean> {
    const currentSlot = await this.getCurrentSlot();
    return currentSlot?.program.slug === programSlug;
  }
}
