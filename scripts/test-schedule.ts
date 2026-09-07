/**
 * Test manual de la lógica de schedule.
 * Verifica que el resultado no cambia según la máquina donde corre.
 *
 * Ejecutar: npx tsx scripts/test-schedule.ts
 */

import { dailySchedule } from '../src/mocks/schedule';
import { programs } from '../src/mocks/programs';
import {
  channelTimeToUTC,
  formatAsChannelISO,
  getSlotStatus,
  findCurrentSlot,
  findNextSlot,
} from '../src/lib/schedule/time';
import { CHANNEL_TIMEZONE } from '../src/lib/config/site';
import type { ScheduleSlot } from '../src/types/content';

const programsBySlug = new Map(programs.map((p) => [p.slug, p]));

function buildSlotsForDate(
  year: number,
  month: number,
  day: number,
  nowTimestamp: number
): ScheduleSlot[] {
  return dailySchedule
    .map((raw) => {
      const program = programsBySlug.get(raw.programSlug);
      if (!program) return null;

      const startTimestamp = channelTimeToUTC(year, month, day, raw.startHour, raw.startMinute);
      const endTimestamp = startTimestamp + raw.durationMinutes * 60 * 1000;

      const startTime = formatAsChannelISO(startTimestamp);
      const endTime = formatAsChannelISO(endTimestamp);
      const status = getSlotStatus(startTime, endTime, nowTimestamp);

      return { id: raw.id, program, startTime, endTime, status };
    })
    .filter((slot): slot is ScheduleSlot => slot !== null);
}

// Tres instantes fijos para probar (todos en horario de São Paulo)
const testCases = [
  {
    name: '07:30 São Paulo (debería ser Verdades para Hoje)',
    // 2024-01-15 07:30 São Paulo = 2024-01-15 10:30 UTC
    timestamp: Date.UTC(2024, 0, 15, 10, 30, 0),
    expectedProgram: 'Verdades para Hoje',
  },
  {
    name: '12:15 São Paulo (debería ser Fonte de Água Viva)',
    // 2024-01-15 12:15 São Paulo = 2024-01-15 15:15 UTC
    timestamp: Date.UTC(2024, 0, 15, 15, 15, 0),
    expectedProgram: 'Fonte de Água Viva',
  },
  {
    name: '20:45 São Paulo (debería ser Filmes)',
    // 2024-01-15 20:45 São Paulo = 2024-01-15 23:45 UTC
    timestamp: Date.UTC(2024, 0, 15, 23, 45, 0),
    expectedProgram: 'Filmes',
  },
];

console.log('='.repeat(60));
console.log('TEST MANUAL DE SCHEDULE');
console.log(`Zona horaria del canal: ${CHANNEL_TIMEZONE}`);
console.log(`Zona horaria del sistema: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
console.log('='.repeat(60));
console.log();

let allPassed = true;

for (const testCase of testCases) {
  const slots = buildSlotsForDate(2024, 1, 15, testCase.timestamp);
  const current = findCurrentSlot(slots, testCase.timestamp);
  const next = findNextSlot(slots, testCase.timestamp);

  const passed = current?.program.title === testCase.expectedProgram;
  if (!passed) allPassed = false;

  console.log(`📍 ${testCase.name}`);
  console.log(`   Timestamp: ${new Date(testCase.timestamp).toISOString()}`);
  console.log(`   Programa actual: ${current?.program.title ?? '(ninguno)'}`);
  console.log(`   Horario: ${current?.startTime ?? '-'} → ${current?.endTime ?? '-'}`);
  console.log(`   Siguiente: ${next?.program.title ?? '(ninguno)'}`);
  console.log(`   ${passed ? '✅ CORRECTO' : `❌ ESPERADO: ${testCase.expectedProgram}`}`);
  console.log();
}

console.log('='.repeat(60));
console.log(allPassed ? '✅ TODOS LOS TESTS PASARON' : '❌ ALGUNOS TESTS FALLARON');
console.log('='.repeat(60));

process.exit(allPassed ? 0 : 1);
