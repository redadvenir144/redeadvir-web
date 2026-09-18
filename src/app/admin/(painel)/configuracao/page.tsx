import { requireUser } from '@/lib/auth/guard';
import { getAllSettings } from '@/lib/admin/queries';
import type { SettingsMap } from '@/lib/data/settings.repository';
import {
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SITE_VERSE,
  SATELLITE_INFO,
  APP_LINKS,
  CONTACT_INFO,
} from '@/lib/config/site';
import { SettingsForm } from './SettingsForm';

export default async function ConfiguracaoPage() {
  await requireUser();
  const settings = await getAllSettings();

  // Lo que el sitio usa hoy si el campo queda vacío. Se muestra como
  // placeholder para que quede claro qué pasa al no rellenar nada.
  const defaults: SettingsMap = {
    stream_url: process.env.NEXT_PUBLIC_STREAM_URL ?? '',
    site_tagline: SITE_TAGLINE,
    site_description: SITE_DESCRIPTION,
    site_verse: SITE_VERSE,
    satellite_provider: SATELLITE_INFO.provider,
    satellite_channel: String(SATELLITE_INFO.channel),
    app_android: APP_LINKS.android,
    app_ios: APP_LINKS.ios,
    contact_email: CONTACT_INFO.email ?? '',
  };

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configuração
        </h1>
        <p className="text-gray-600 dark:text-text-secondary mt-1">
          Campos vazios usam o valor padrão mostrado em cinza.
        </p>
      </header>

      <SettingsForm settings={settings} defaults={defaults} />
    </>
  );
}
