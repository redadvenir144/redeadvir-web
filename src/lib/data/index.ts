/**
 * Punto único de acceso a los repositorios.
 * Para cambiar de adaptador (mock → WordPress), modificar solo este archivo.
 */

import { MockProgramsAdapter, MockScheduleAdapter } from '@/lib/adapters/mock';
import type { ProgramsRepository } from './programs.repository';
import type { ScheduleRepository } from './schedule.repository';

// Instancias activas — hoy: mock
export const programsRepository: ProgramsRepository = new MockProgramsAdapter();
export const scheduleRepository: ScheduleRepository = new MockScheduleAdapter();
