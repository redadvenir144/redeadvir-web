import type {
  SettingsRepository,
  SettingsMap,
  SettingKey,
} from '@/lib/data/settings.repository';

/**
 * Sin base de datos no hay ajustes guardados: quien llama cae a los valores
 * por defecto de site.ts. Devolver vacío es la respuesta correcta, no un error.
 */
export class MockSettingsAdapter implements SettingsRepository {
  async getAll(): Promise<SettingsMap> {
    return {};
  }

  async get(_key: SettingKey): Promise<string | null> {
    return null;
  }
}
