/**
 * Configuración global del sitio.
 */

/** Zona horaria del canal (São Paulo, Brasil) */
export const CHANNEL_TIMEZONE = 'America/Sao_Paulo';

/** Nombre del canal (siempre en mayúsculas) */
export const SITE_NAME = 'REDE ADVIR';

/** Nombre largo del canal */
export const SITE_LONG_NAME = 'Rede Advir Televisão';

/** Lema del canal */
export const SITE_TAGLINE = 'O canal da volta de Jesus';

/** Descripción del sitio para SEO */
export const SITE_DESCRIPTION =
  'Rede de televisão adventista do sétimo dia, sem fins lucrativos. Transmitimos TV ao vivo com alcance internacional.';

/** URL canónica del sitio */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://redeadvir.tv').replace(
  /\/$/,
  ''
);

/** Versículo bíblico del canal */
export const SITE_VERSE = '"Porque ainda um pouco de tempo, e aquele que há de vir virá e não tardará" — Hebreus 10:37';

/** Información del ministerio */
export const MINISTRY_INFO = {
  name: 'Gospel Ministries International (GMI)',
  url: 'https://gospelministry.org/',
  founder: 'Pastor David Gates',
  foundedYear: 2002,
} as const;

/** Navegación principal */
export const NAV_ITEMS = [
  { label: 'AO VIVO', href: '/', isLive: true },
  { label: 'Programação', href: '/programacao', isLive: false },
  { label: 'Programas', href: '/programas', isLive: false },
  { label: 'Vídeos', href: '/videos', isLive: false },
  { label: 'Sobre', href: '/sobre', isLive: false },
] as const;

/** Redes sociales */
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/redeadvir',
  instagram: 'https://www.instagram.com/redeadvir',
  youtube: 'https://www.youtube.com/@redeadvir',
  whatsapp: null, // Confirmar con el cliente
  telegram: null, // Confirmar con el cliente
  tiktok: null, // Confirmar con el cliente
} as const;

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

/** Información de donación - Gospel Ministries International */
export const DONATION_INFO = {
  /** URL directa de PayPal para donaciones */
  paypalUrl:
    'https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=accounting@gospelministry.org&item_name=REDE+ADVIR&currency_code=USD&no_shipping=1&lc=US&bn=PP-DonationsBF',
  /** Organización matriz */
  organization: 'Gospel Ministries International',
  organizationUrl: 'https://gospelministry.org/',
  /** Dirección para cheques/transferencias */
  address: 'P.O. Box 506, Collegedale, TN 37315, USA',
  /** Email de contacto para donaciones */
  email: 'accounting@gospelministry.org',
} as const;

/** Enlaces a recursos de la red GMI */
export const GMI_LINKS = [
  { name: 'Gospel Ministries International', url: 'https://gospelministry.org' },
  { name: 'GMI TV', url: 'https://www.gmitv.org' },
  { name: 'Red ADvenir (Español)', url: 'https://redadvenir.org' },
  { name: 'GMI Volunteers', url: 'https://www.gmivolunteers.org' },
  { name: 'Assistir TV ao Vivo (GMI)', url: 'https://gospelministry.org/watch-tv/' },
] as const;

/** Canales hermanos de la red GMI en el mundo */
export const GMI_CHANNELS = [
  {
    name: 'Red ADvenir Internacional',
    region: 'Bolivia / América Latina',
    language: 'Español',
    url: 'https://redadvenir.org',
  },
  {
    name: 'TV Famille',
    region: 'Martinica / Mundo francófono',
    language: 'Francês',
    url: 'https://tvfamille.org/',
  },
  {
    name: 'Firstlight',
    region: 'Nova Zelândia',
    language: 'Inglês',
    url: 'https://www.firstlight.org.nz/',
  },
  {
    name: 'Global Family Network',
    region: 'Granada (Caribe)',
    language: 'Inglês',
    url: 'https://gospelministry.org/global-family-network/',
  },
  {
    name: 'Light Channel',
    region: 'Europa (Alemanha, Itália, Hungria, etc.)',
    language: 'Vários',
    url: 'https://www.lightchanneltv.de/',
  },
] as const;

/** Plataformas Smart TV donde está disponible */
export const SMART_TV_PLATFORMS = [
  {
    name: 'Roku',
    url: 'https://channelstore.roku.com/details/237107/red-advenir',
    available: true,
  },
  {
    name: 'Amazon Fire TV',
    url: 'https://www.amazon.com/Gospel-Ministries-International-Red-Advenir/dp/B07GVQJPL5',
    available: true,
  },
] as const;
