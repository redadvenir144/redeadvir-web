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
  { label: 'Início', href: '/', isLive: false },
  { label: 'AO VIVO', href: '/', isLive: true },
  { label: 'Programação', href: '/programacao', isLive: false },
  { label: 'Programas', href: '/programas', isLive: false },
  { label: 'Vídeos', href: '/videos', isLive: false },
  { label: 'Notícias', href: '/noticias', isLive: false },
  { label: 'Canais', href: '/canais', isLive: false },
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

/**
 * Canal en TV aberta. Se muestra destacado en la portada.
 *
 * Se guarda aparte de SATELLITE_INFO a propósito: aunque hoy el número
 * coincide, "TV Aberta" y "satélite Vivensis" son dos formas distintas de
 * sintonizar el canal y conviene poder cambiarlas por separado.
 */
export const OPEN_TV_INFO = {
  label: 'TV Aberta',
  channel: '7777',
} as const;

/**
 * Parámetros de recepción por satélite, facilitados por el canal.
 * Son los datos que hay que introducir en el receptor para sintonizar.
 */
export const SATELLITE_SIGNAL = {
  title: 'Sinal de satélite — REDE ADVIR Brasil',
  params: [
    { label: 'Satélite', value: 'STAR ONE D2' },
    { label: 'Banda', value: 'Ku' },
    { label: 'Frequência', value: '11860 MHz' },
    { label: 'Polarização', value: 'Horizontal (H)' },
    { label: 'Taxa de Símbolos (SR)', value: '29892 kbps' },
    { label: 'Padrão', value: 'DVB-S2 8psk' },
    { label: 'Compressão de Vídeo', value: 'MPEG-4' },
  ],
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

/**
 * Canales hermanos de la red GMI en el mundo.
 *
 * Fuente: el proyecto de Red ADvenir (lib/gmiChannels.ts), que a su vez cita
 * https://gospelministry.org/all-projects/ como lista oficial. Son 16, no los
 * 7 que enseña su web pública: allí solo se muestran los que tienen logotipo.
 *
 * `url` es opcional a propósito: varios proyectos aún no tienen sitio propio
 * y no se inventa uno — la tarjeta se pinta sin enlace.
 */
export const GMI_CHANNELS: readonly {
  name: string;
  region: string;
  language: string;
  url?: string;
}[] = [
  // Sede
  {
    name: 'Red ADvenir Internacional',
    region: 'Bolívia',
    language: 'Espanhol',
    url: 'https://redadvenir.org',
  },

  // Américas
  {
    name: 'GMI TV',
    region: 'Estados Unidos',
    language: 'Inglês / Espanhol',
    url: 'https://www.gmitv.org',
  },
  {
    name: 'Global Family Network',
    region: 'Granada (Caribe)',
    language: 'Inglês',
    url: 'https://gospelministry.org/global-family-network/',
  },
  {
    name: 'Télévision de la Famille',
    region: 'Martinica / Caribe francófono',
    language: 'Francês',
    url: 'https://tvfamille.org/',
  },
  {
    name: 'Mexico Broadcasting Project',
    region: 'México',
    language: 'Espanhol',
  },

  // Europa — rede Light Channel
  {
    name: 'Light Channel Germany',
    region: 'Alemanha',
    language: 'Alemão',
    url: 'https://www.lightchanneltv.de/',
  },
  {
    name: 'Light Channel Italy',
    region: 'Itália',
    language: 'Italiano',
    url: 'https://www.lightchannel.it/',
  },
  {
    name: 'Light Channel Hungary',
    region: 'Hungria',
    language: 'Húngaro',
    url: 'https://ltvhu.org/',
  },
  {
    name: 'Light Channel Bulgaria',
    region: 'Bulgária',
    language: 'Búlgaro',
    url: 'http://www.ltv.bg/',
  },
  {
    name: 'Light Channel Romania',
    region: 'Romênia',
    language: 'Romeno',
    url: 'https://speranta.tv/',
  },
  {
    name: 'Light Channel Holland',
    region: 'Países Baixos',
    language: 'Holandês',
  },

  // Oceania
  {
    name: 'Firstlight Broadcasting',
    region: 'Nova Zelândia',
    language: 'Inglês',
    url: 'https://www.firstlight.org.nz/',
  },

  // Ásia
  {
    name: "He's Coming Broadcasting Network Malaysia",
    region: 'Malásia',
    language: 'Malaio / Inglês',
  },
  {
    name: "He's Coming Broadcasting Network Indonesia",
    region: 'Indonésia',
    language: 'Indonésio',
  },

  // África
  {
    name: '2nd Coming Broadcasting Network',
    region: 'Quênia',
    language: 'Suaíli / Inglês',
  },
] as const;

/** Plataformas donde está disponible REDE ADVIR */
export type Platform = {
  name: string;
  description: string;
  href: string;
  icon: 'roku' | 'firetv' | 'androidtv' | 'appletv' | 'mobile' | 'web';
  available: boolean;
};

export const PLATFORMS: Platform[] = [
  {
    name: 'Roku',
    // TODO: pedir al canal el enlace de la app de REDE ADVIR en Roku.
    // El que había aquí era el de Red ADvenir (Bolívia), copiado del
    // proyecto hermano: mandaba a la audiencia brasileña al canal en español.
    description: 'Em breve na Roku Channel Store',
    href: '#',
    icon: 'roku',
    available: false,
  },
  {
    name: 'Amazon Fire TV',
    // TODO: mismo caso que Roku — falta el enlace de la app brasileña.
    description: 'Em breve na Amazon Appstore',
    href: '#',
    icon: 'firetv',
    available: false,
  },
  {
    name: 'Android',
    description: 'App oficial para seu celular',
    href: APP_LINKS.android,
    icon: 'mobile',
    available: true,
  },
  {
    name: 'iOS (iPhone/iPad)',
    description: 'App oficial para dispositivos Apple',
    href: APP_LINKS.ios,
    icon: 'mobile',
    available: true,
  },
  {
    name: 'Web',
    description: 'Assista aqui mesmo, sem instalar',
    href: '/',
    icon: 'web',
    available: true,
  },
];
