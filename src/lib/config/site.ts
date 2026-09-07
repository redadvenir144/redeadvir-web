/**
 * Configuración global del sitio.
 */

/** Zona horaria del canal (São Paulo, Brasil) */
export const CHANNEL_TIMEZONE = 'America/Sao_Paulo';

/** Nombre del canal */
export const SITE_NAME = 'Rede ADVIR';

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

/** Redes sociales — TODO: confirmar con el cliente */
export const SOCIAL_LINKS = {
  // TODO: confirmar con el cliente
  facebook: 'https://facebook.com/redeadvir',
  // TODO: confirmar con el cliente
  instagram: 'https://instagram.com/redeadvir',
  // TODO: confirmar con el cliente
  youtube: 'https://youtube.com/redeadvir',
  // TODO: confirmar con el cliente
  twitter: 'https://twitter.com/redeadvir',
} as const;

/** Enlaces a las apps — TODO: confirmar con el cliente */
export const APP_LINKS = {
  // TODO: confirmar con el cliente
  android: 'https://play.google.com/store/apps/details?id=br.net.redeadvir',
  // TODO: confirmar con el cliente
  ios: 'https://apps.apple.com/app/rede-advir',
} as const;

/** Datos de contacto — TODO: confirmar con el cliente */
export const CONTACT_INFO = {
  // TODO: confirmar con el cliente
  email: 'contato@redeadvir.net.br',
  // TODO: confirmar con el cliente
  phone: '+55 11 0000-0000',
  // TODO: confirmar con el cliente
  address: 'São Paulo, SP - Brasil',
} as const;

/** Información del satélite */
export const SATELLITE_INFO = {
  provider: 'Vivensis',
  channel: '7777',
} as const;

/** Enlaces de políticas */
export const POLICY_LINKS = [
  { label: 'Política de Privacidade', href: '/privacidade' },
  { label: 'Termos de Uso', href: '/termos' },
] as const;
