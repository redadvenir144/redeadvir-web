'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/guard';
import { saveSettings } from '@/lib/admin/queries';
import type {
  SettingKey,
  SettingsMap,
} from '@/lib/data/settings.repository';
import {
  readText,
  describeDbError,
  type ActionState,
} from '@/lib/admin/form';

/** Las claves que este formulario sabe guardar. */
const EDITABLE_KEYS: SettingKey[] = [
  'stream_url',
  'site_tagline',
  'site_description',
  'site_verse',
  'satellite_provider',
  'satellite_channel',
  'social_facebook',
  'social_instagram',
  'social_youtube',
  'app_android',
  'app_ios',
  'contact_email',
  'contact_whatsapp',
];

/** Claves que solo aceptan una URL. */
const URL_KEYS = new Set<SettingKey>([
  'stream_url',
  'social_facebook',
  'social_instagram',
  'social_youtube',
  'app_android',
  'app_ios',
]);

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function saveSettingsAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const entries: SettingsMap = {};

  for (const key of EDITABLE_KEYS) {
    const value = readText(formData, key);

    // Un campo vacío significa "usar el valor por defecto de site.ts",
    // así que se guarda vacío en vez de rechazarse.
    if (value && URL_KEYS.has(key) && !isValidHttpUrl(value)) {
      return {
        error: `O endereço informado em "${key}" não é válido. Ele precisa começar com http:// ou https://.`,
      };
    }

    entries[key] = value;
  }

  const streamUrl = entries.stream_url;
  if (streamUrl && !streamUrl.includes('.m3u8')) {
    return {
      error:
        'O endereço da transmissão precisa terminar em .m3u8. Confirme com o provedor antes de salvar.',
    };
  }

  try {
    await saveSettings(entries);
  } catch (error) {
    return { error: describeDbError(error, 'saveSettings') };
  }

  // La configuración toca el pie de página, que está en todas las rutas.
  revalidatePath('/', 'layout');
  revalidatePath('/admin/configuracao');
  return { success: 'Configuração salva.' };
}
