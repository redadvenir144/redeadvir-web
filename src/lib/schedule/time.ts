/**
 * Funciones puras para cálculos temporales de la grilla.
 * Todas operan con la zona horaria del canal explícitamente.
 */

import { CHANNEL_TIMEZONE } from '@/lib/config/site';
import type { ScheduleSlot } from '@/types/content';

/**
 * Obtiene los componentes de fecha/hora en la zona horaria del canal.
 */
export function getDatePartsInChannelTimezone(date: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: CHANNEL_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: string) => parseInt(parts.find((p) => p.type === type)?.value ?? '0', 10);

  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
    second: get('second'),
  };
}

/**
 * Obtiene el offset en minutos de la zona del canal para una fecha dada.
 * Positivo = adelantado respecto a UTC, Negativo = atrasado respecto a UTC.
 * São Paulo es típicamente -180 minutos (-3 horas).
 */
function getChannelOffsetMinutes(date: Date): number {
  // Creamos dos formateadores: uno para UTC y otro para la zona del canal
  const utcFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const channelFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: CHANNEL_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const utcParts = utcFormatter.formatToParts(date);
  const channelParts = channelFormatter.formatToParts(date);

  const getNum = (parts: Intl.DateTimeFormatPart[], type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value ?? '0', 10);

  const utcMinutes =
    getNum(utcParts, 'day') * 24 * 60 +
    getNum(utcParts, 'hour') * 60 +
    getNum(utcParts, 'minute');

  const channelMinutes =
    getNum(channelParts, 'day') * 24 * 60 +
    getNum(channelParts, 'hour') * 60 +
    getNum(channelParts, 'minute');

  // Si channelMinutes < utcMinutes, el canal está atrasado (offset negativo)
  return channelMinutes - utcMinutes;
}

/**
 * Convierte hora y minuto del canal a un timestamp UTC para un día específico.
 */
export function channelTimeToUTC(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): number {
  // Estimación inicial: asumimos offset -3 para São Paulo
  const estimatedUtc = Date.UTC(year, month - 1, day, hour + 3, minute, 0);

  // Obtenemos el offset real para esa fecha (puede variar por horario de verano)
  const realOffset = getChannelOffsetMinutes(new Date(estimatedUtc));

  // Calculamos el timestamp correcto
  // Si la hora local es 07:30 y el offset es -180 minutos (-3h), en UTC es 10:30
  return Date.UTC(year, month - 1, day, hour, minute, 0) - realOffset * 60 * 1000;
}

/**
 * Formatea un timestamp como ISO 8601 con el offset del canal.
 */
export function formatAsChannelISO(timestamp: number): string {
  const date = new Date(timestamp);

  const { year, month, day, hour, minute, second } = getDatePartsInChannelTimezone(date);

  // Obtenemos el offset para esta fecha
  const offsetMinutes = getChannelOffsetMinutes(date);
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMins = Math.abs(offsetMinutes) % 60;
  const offsetSign = offsetMinutes >= 0 ? '+' : '-';
  const offsetFormatted = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}${offsetFormatted}`;
}

/**
 * Determina el status de un slot dado un instante de referencia.
 * Función pura: no depende de Date.now().
 */
export function getSlotStatus(
  startTime: string,
  endTime: string,
  nowTimestamp: number
): ScheduleSlot['status'] {
  const startTimestamp = new Date(startTime).getTime();
  const endTimestamp = new Date(endTime).getTime();

  if (nowTimestamp >= endTimestamp) {
    return 'past';
  }
  if (nowTimestamp >= startTimestamp && nowTimestamp < endTimestamp) {
    return 'live';
  }
  return 'upcoming';
}

/**
 * Encuentra el slot actualmente en emisión.
 * Función pura: recibe el instante como parámetro.
 */
export function findCurrentSlot(
  slots: ScheduleSlot[],
  nowTimestamp: number
): ScheduleSlot | null {
  return slots.find((slot) => {
    const status = getSlotStatus(slot.startTime, slot.endTime, nowTimestamp);
    return status === 'live';
  }) ?? null;
}

/**
 * Encuentra el siguiente slot después del actual.
 * Función pura: recibe el instante como parámetro.
 */
export function findNextSlot(
  slots: ScheduleSlot[],
  nowTimestamp: number
): ScheduleSlot | null {
  const upcomingSlots = slots.filter((slot) => {
    const status = getSlotStatus(slot.startTime, slot.endTime, nowTimestamp);
    return status === 'upcoming';
  });

  if (upcomingSlots.length === 0) {
    return null;
  }

  // Ordenar por hora de inicio y tomar el primero
  return upcomingSlots.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )[0];
}

/**
 * Extrae año, mes, día de un string ISO 8601.
 */
export function extractDateParts(isoString: string): {
  year: number;
  month: number;
  day: number;
} {
  const [datePart] = isoString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  return { year, month, day };
}

/**
 * Franjas horarias del día.
 */
export type TimeSlotPeriod = 'madrugada' | 'manha' | 'tarde' | 'noite';

export const TIME_SLOT_LABELS: Record<TimeSlotPeriod, string> = {
  madrugada: 'Madrugada',
  manha: 'Manhã',
  tarde: 'Tarde',
  noite: 'Noite',
};

/**
 * Determina la franja horaria de un slot según su hora de inicio.
 * Madrugada: 00:00-05:59, Manhã: 06:00-11:59, Tarde: 12:00-17:59, Noite: 18:00-23:59
 */
export function getTimeSlotPeriod(startTime: string): TimeSlotPeriod {
  const date = new Date(startTime);
  const { hour } = getDatePartsInChannelTimezone(date);

  if (hour < 6) return 'madrugada';
  if (hour < 12) return 'manha';
  if (hour < 18) return 'tarde';
  return 'noite';
}

/**
 * Agrupa slots por franja horaria.
 * Retorna un Map ordenado: madrugada → manhã → tarde → noite.
 */
export function groupSlotsByPeriod(
  slots: ScheduleSlot[]
): Map<TimeSlotPeriod, ScheduleSlot[]> {
  const groups = new Map<TimeSlotPeriod, ScheduleSlot[]>([
    ['madrugada', []],
    ['manha', []],
    ['tarde', []],
    ['noite', []],
  ]);

  for (const slot of slots) {
    const period = getTimeSlotPeriod(slot.startTime);
    groups.get(period)!.push(slot);
  }

  // Eliminar grupos vacíos
  for (const [period, periodSlots] of groups) {
    if (periodSlots.length === 0) {
      groups.delete(period);
    }
  }

  return groups;
}

/**
 * Formatea una fecha como string ISO (solo fecha, sin hora) en timezone del canal.
 */
export function formatDateAsISODate(date: Date): string {
  const { year, month, day } = getDatePartsInChannelTimezone(date);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Suma días a una fecha y retorna el ISO date string.
 */
export function addDaysToDate(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days, 12, 0, 0));
  return formatDateAsISODate(date);
}
