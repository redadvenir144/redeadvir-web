/**
 * Claves de configuración editables desde el admin.
 *
 * Es un union cerrado a propósito: así el compilador avisa si alguien pide
 * una clave que el admin no sabe editar.
 */
export type SettingKey =
  | 'stream_url'
  | 'site_tagline'
  | 'site_description'
  | 'site_verse'
  | 'satellite_provider'
  | 'satellite_channel'
  | 'social_facebook'
  | 'social_instagram'
  | 'social_youtube'
  | 'app_android'
  | 'app_ios'
  | 'contact_email'
  | 'contact_whatsapp';

export type SettingsMap = Partial<Record<SettingKey, string>>;

/**
 * Contrato del repositorio de configuración del sitio.
 */
export interface SettingsRepository {
  /** Devuelve todos los ajustes guardados. */
  getAll(): Promise<SettingsMap>;

  /**
   * Devuelve un ajuste concreto.
   * Null si no está guardado, para que quien llame decida el valor por defecto.
   */
  get(key: SettingKey): Promise<string | null>;
}
