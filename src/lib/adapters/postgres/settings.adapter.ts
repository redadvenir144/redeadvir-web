import 'server-only';
import type {
  SettingsRepository,
  SettingsMap,
  SettingKey,
} from '@/lib/data/settings.repository';
import { requireSql } from '@/lib/db/client';

export class PostgresSettingsAdapter implements SettingsRepository {
  async getAll(): Promise<SettingsMap> {
    const sql = requireSql();
    const rows = await sql<{ key: string; value: string }[]>`
      SELECT key, value FROM site_settings
    `;

    const map: SettingsMap = {};
    for (const row of rows) {
      // La clave viene de la base de datos, así que puede no estar en el union.
      // Guardamos solo lo que el admin sabe editar.
      map[row.key as SettingKey] = row.value;
    }
    return map;
  }

  async get(key: SettingKey): Promise<string | null> {
    const sql = requireSql();
    const rows = await sql<{ value: string }[]>`
      SELECT value FROM site_settings WHERE key = ${key} LIMIT 1
    `;
    return rows[0]?.value ?? null;
  }
}
