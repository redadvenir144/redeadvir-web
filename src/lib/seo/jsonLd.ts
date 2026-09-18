import {
  SITE_NAME,
  SITE_LONG_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
  SOCIAL_LINKS,
  MINISTRY_INFO,
  SATELLITE_INFO,
} from '@/lib/config/site';

/**
 * Datos estructurados del sitio.
 *
 * Se generan como objetos para poder tiparlos y probarlos; el componente
 * `JsonLd` los serializa. Los tipos de schema.org no tienen definición oficial
 * en TypeScript, así que se modelan como Record de valores JSON.
 */
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonLdObject = Record<string, JsonValue>;

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const STATION_ID = `${SITE_URL}/#station`;
const LOGO_URL = `${SITE_URL}/images/logo.png`;

/** Perfiles sociales que realmente existen. */
function socialProfiles(): string[] {
  const urls: (string | null | undefined)[] = [
    SOCIAL_LINKS.facebook,
    SOCIAL_LINKS.instagram,
    SOCIAL_LINKS.youtube,
  ];
  return urls.filter((url): url is string => Boolean(url));
}

export function organizationJsonLd(): JsonLdObject {
  const sameAs = socialProfiles();

  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_LONG_NAME,
    alternateName: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 512,
      height: 512,
    },
    foundingDate: String(MINISTRY_INFO.foundedYear),
    founder: { '@type': 'Person', name: MINISTRY_INFO.founder },
    parentOrganization: {
      '@type': 'Organization',
      name: MINISTRY_INFO.name,
      url: MINISTRY_INFO.url,
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function televisionStationJsonLd(): JsonLdObject {
  return {
    '@type': 'TelevisionStation',
    '@id': STATION_ID,
    name: SITE_LONG_NAME,
    alternateName: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'pt-BR',
    areaServed: { '@type': 'Country', name: 'Brasil' },
    broadcastAffiliateOf: { '@id': ORGANIZATION_ID },
    parentOrganization: { '@id': ORGANIZATION_ID },
    broadcastDisplayName: SITE_NAME,
    broadcastChannel: {
      '@type': 'BroadcastChannel',
      name: `${SATELLITE_INFO.provider} · Canal ${SATELLITE_INFO.channel}`,
      broadcastChannelId: String(SATELLITE_INFO.channel),
    },
  };
}

/**
 * VideoObject del directo.
 *
 * `isLiveBroadcast` con `startDate` es lo que Google usa para el distintivo
 * "AO VIVO" en los resultados. Emitimos 24/7, así que no hay `endDate`.
 */
export function liveVideoJsonLd(options: {
  /** ISO 8601 con offset. */
  startDate: string;
  thumbnailUrl: string;
  currentProgramTitle?: string;
}): JsonLdObject {
  const name = options.currentProgramTitle
    ? `${options.currentProgramTitle} — ${SITE_NAME} ao vivo`
    : `${SITE_NAME} ao vivo`;

  return {
    '@type': 'VideoObject',
    name,
    description: SITE_DESCRIPTION,
    thumbnailUrl: options.thumbnailUrl,
    uploadDate: options.startDate,
    isLiveBroadcast: true,
    publication: {
      '@type': 'BroadcastEvent',
      isLiveBroadcast: true,
      startDate: options.startDate,
    },
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'pt-BR',
    embedUrl: SITE_URL,
  };
}

/** Envuelve uno o varios objetos en un @graph con el @context. */
export function graph(...nodes: JsonLdObject[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes as JsonValue[],
  };
}
