import type { ScheduleSlot, Program } from '@/types/content';
import type { ScheduleRepository, BroadcastTime } from '@/lib/data/schedule.repository';
import { dailySchedule } from '@/mocks/schedule';
import { programs } from '@/mocks/programs';
import {
  channelTimeToUTC,
  formatAsChannelISO,
  getSlotStatus,
  findCurrentSlot,
  findNextSlot,
  extractDateParts,
  getDatePartsInChannelTimezone,
} from '@/lib/schedule/time';

export class MockScheduleAdapter implements ScheduleRepository {
  private programsBySlug: Map<string, Program>;

  constructor() {
    this.programsBySlug = new Map(programs.map((p) => [p.slug, p]));
  }

  /**
   * Construye los slots para un día específico.
   * El status se calcula usando la lógica pura de time.ts.
   */
  private buildSlotsForDate(
    year: number,
    month: number,
    day: number,
    nowTimestamp: number
  ): ScheduleSlot[] {
    return dailySchedule
      .map((raw) => {
        const program = this.programsBySlug.get(raw.programSlug);
        if (!program) return null;

        const startTimestamp = channelTimeToUTC(year, month, day, raw.startHour, raw.startMinute);
        const endTimestamp = startTimestamp + raw.durationMinutes * 60 * 1000;

        const startTime = formatAsChannelISO(startTimestamp);
        const endTime = formatAsChannelISO(endTimestamp);

        const status = getSlotStatus(startTime, endTime, nowTimestamp);

        return {
          id: `${raw.id}-${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`,
          program,
          startTime,
          endTime,
          status,
        };
      })
      .filter((slot): slot is ScheduleSlot => slot !== null);
  }

  async getByDate(date: string): Promise<ScheduleSlot[]> {
    const { year, month, day } = extractDateParts(date);
    const nowTimestamp = Date.now();
    return this.buildSlotsForDate(year, month, day, nowTimestamp);
  }

  async getCurrentSlot(): Promise<ScheduleSlot | null> {
    const nowTimestamp = Date.now();
    const { year, month, day } = getDatePartsInChannelTimezone(new Date(nowTimestamp));
    const slots = this.buildSlotsForDate(year, month, day, nowTimestamp);
    return findCurrentSlot(slots, nowTimestamp);
  }

  async getNextSlot(): Promise<ScheduleSlot | null> {
    const nowTimestamp = Date.now();
    const { year, month, day } = getDatePartsInChannelTimezone(new Date(nowTimestamp));
    const slots = this.buildSlotsForDate(year, month, day, nowTimestamp);
    return findNextSlot(slots, nowTimestamp);
  }

  async getBroadcastTimesForProgram(programSlug: string): Promise<BroadcastTime[]> {
    return dailySchedule
      .filter((slot) => slot.programSlug === programSlug)
      .map((slot) => ({
        hour: slot.startHour,
        minute: slot.startMinute,
      }))
      .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
  }

  async isProgramLiveNow(programSlug: string): Promise<boolean> {
    const currentSlot = await this.getCurrentSlot();
    return currentSlot?.program.slug === programSlug;
  }
}
