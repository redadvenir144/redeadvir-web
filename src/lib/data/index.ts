/**
 * Punto único de acceso a los repositorios.
 *
 * El adaptador activo se elige aquí y en ningún otro sitio: si hay
 * `DATABASE_URL`, el contenido viene de Postgres y es editable desde /admin.
 * Si no la hay, cae a `mock` para que la web pública siga en pie aunque la
 * base de datos no esté configurada todavía.
 */

import { isDatabaseConfigured } from '@/lib/db/client';
import { withFallback } from './fallback';

import {
  MockProgramsAdapter,
  MockScheduleAdapter,
  MockVideosAdapter,
  MockPagesAdapter,
  MockSettingsAdapter,
  MockNewsAdapter,
} from '@/lib/adapters/mock';

import {
  PostgresProgramsAdapter,
  PostgresScheduleAdapter,
  PostgresVideosAdapter,
  PostgresPagesAdapter,
  PostgresSettingsAdapter,
  PostgresNewsAdapter,
} from '@/lib/adapters/postgres';

import type { ProgramsRepository } from './programs.repository';
import type { ScheduleRepository } from './schedule.repository';
import type { VideosRepository } from './videos.repository';
import type { PagesRepository } from './pages.repository';
import type { SettingsRepository } from './settings.repository';
import type { NewsRepository } from './news.repository';

/** Qué fuente de datos está sirviendo el sitio ahora mismo. */
export const activeDataSource: 'postgres' | 'mock' = isDatabaseConfigured
  ? 'postgres'
  : 'mock';

/**
 * Elige el adaptador y, con base de datos activa, lo envuelve para que un
 * fallo de Postgres degrade a los datos locales en vez de romper la página.
 */
function pick<T extends object>(
  postgresAdapter: () => T,
  mockAdapter: () => T,
  label: string,
): T {
  const mock = mockAdapter();
  if (!isDatabaseConfigured) return mock;
  return withFallback(postgresAdapter(), mock, label);
}

export const programsRepository: ProgramsRepository = pick<ProgramsRepository>(
  () => new PostgresProgramsAdapter(),
  () => new MockProgramsAdapter(),
  'programs',
);

export const scheduleRepository: ScheduleRepository = pick<ScheduleRepository>(
  () => new PostgresScheduleAdapter(),
  () => new MockScheduleAdapter(),
  'schedule',
);

export const videosRepository: VideosRepository = pick<VideosRepository>(
  () => new PostgresVideosAdapter(),
  () => new MockVideosAdapter(),
  'videos',
);

export const pagesRepository: PagesRepository = pick<PagesRepository>(
  () => new PostgresPagesAdapter(),
  () => new MockPagesAdapter(),
  'pages',
);

export const settingsRepository: SettingsRepository = pick<SettingsRepository>(
  () => new PostgresSettingsAdapter(),
  () => new MockSettingsAdapter(),
  'settings',
);

export const newsRepository: NewsRepository = pick<NewsRepository>(
  () => new PostgresNewsAdapter(),
  () => new MockNewsAdapter(),
  'news',
);
