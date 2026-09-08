/**
 * Configuración global del sitio.
 */

/** Zona horaria del canal (São Paulo, Brasil) */
export const CHANNEL_TIMEZONE = 'America/Sao_Paulo';

/** Nombre del canal (siempre en mayúsculas) */
export const SITE_NAME = 'REDE ADVIR';

/** Lema del canal */
export const SITE_TAGLINE = 'O canal da volta de Jesus';

/** Navegación principal */
export const NAV_ITEMS = [
  { label: 'AO VIVO', href: '/', isLive: true },
  { label: 'Programação', href: '/programacao', isLive: false },
  { label: 'Programas', href: '/programas', isLive: false },
  { label: 'Vídeos', href: '/videos', isLive: false },
  { label: 'Sobre', href: '/sobre', isLive: false },
] as const;

/** Redes sociales — null hasta confirmar con el cliente */
export const SOCIAL_LINKS: {
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  twitter: string | null;
} = {
  facebook: null,
  instagram: null,
  youtube: null,
  twitter: null,
};

/** Enlaces a las apps (confirmados) */
export const APP_LINKS = {
  android: 'https://play.google.com/store/apps/details?id=com.logicahost.redeadvir',
  ios: 'https://apps.apple.com/us/app/rede-advir/id6738403202',
} as const;

/** Datos de contacto — null hasta confirmar con el cliente */
export const CONTACT_INFO: {
  email: string | null;
  phone: string | null;
  address: string | null;
} = {
  email: null,
  phone: null,
  address: null,
};

/** Información del satélite (confirmado) */
export const SATELLITE_INFO = {
  provider: 'Vivensis',
  channel: '7777',
} as const;

/** Enlaces de políticas */
export const POLICY_LINKS = [
  { label: 'Política de Privacidade', href: '/privacidade' },
  { label: 'Termos de Uso', href: '/termos' },
] as const;
