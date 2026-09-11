import Link from 'next/link';
import {
  SITE_NAME,
  SITE_LONG_NAME,
  SITE_TAGLINE,
  SITE_VERSE,
  SATELLITE_INFO,
  SOCIAL_LINKS,
  APP_LINKS,
  POLICY_LINKS,
  GMI_LINKS,
  MINISTRY_INFO,
} from '@/lib/config/site';

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={[
        'inline-block py-1',
        'text-gray-600 hover:text-gray-900 dark:text-text-secondary dark:hover:text-white',
        'transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
      ].join(' ')}
    >
      {children}
    </Link>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        'inline-flex items-center justify-center',
        'min-h-11 min-w-11 p-2',
        'rounded-full',
        'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
        'dark:text-text-secondary dark:hover:text-white dark:hover:bg-tv-hover',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
      ].join(' ')}
      aria-label={label}
    >
      {children}
    </a>
  );
}

function AppStoreLink({
  href,
  store,
}: {
  href: string;
  store: 'android' | 'ios';
}) {
  const labels = {
    android: 'Baixar na Google Play',
    ios: 'Baixar na App Store',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        'inline-flex items-center gap-2 px-4 py-2',
        'bg-gray-100 hover:bg-gray-200 dark:bg-tv-elevated dark:hover:bg-tv-hover',
        'border border-gray-200 hover:border-brand-400 dark:border-tv-border dark:hover:border-brand-600/30',
        'rounded-xl',
        'text-sm text-gray-900 dark:text-white',
        'transition-all duration-200',
        'min-h-11',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
      ].join(' ')}
      aria-label={labels[store]}
    >
      {store === 'android' ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.523 2.047a.5.5 0 0 0-.726.45v.002L14.033 6.8a9.454 9.454 0 0 0-4.066 0L7.203 2.499a.5.5 0 0 0-.726-.45.5.5 0 0 0-.273.45l.001 4.3A9.5 9.5 0 0 0 2 14.5v.5a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-.5a9.5 9.5 0 0 0-4.205-7.801l.001-4.2a.5.5 0 0 0-.273-.451zM8.5 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM3 17a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0v-3a1 1 0 0 0-1-1zm18 0a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0v-3a1 1 0 0 0-1-1zM5 17h14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      )}
      <span>{labels[store]}</span>
    </a>
  );
}

// Iconos de redes sociales
function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function BroadcastIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Verificar si hay redes sociales disponibles
  const hasSocialLinks = SOCIAL_LINKS.facebook || SOCIAL_LINKS.instagram || SOCIAL_LINKS.youtube;

  return (
    <footer className="bg-gray-50 dark:bg-tv-card border-t border-gray-200 dark:border-tv-border text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Columna institucional */}
          <div>
            <h2 className="font-bold text-lg mb-4">{SITE_NAME}</h2>
            <p className="text-gray-600 dark:text-text-secondary text-sm mb-4">{SITE_TAGLINE}</p>
            <p className="text-gray-500 dark:text-text-muted text-sm mb-4">
              {SATELLITE_INFO.provider} · Canal {SATELLITE_INFO.channel}
            </p>
            {/* Redes sociales */}
            {hasSocialLinks && (
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.facebook && (
                  <SocialLink href={SOCIAL_LINKS.facebook} label="Facebook da REDE ADVIR">
                    <FacebookIcon />
                  </SocialLink>
                )}
                {SOCIAL_LINKS.instagram && (
                  <SocialLink href={SOCIAL_LINKS.instagram} label="Instagram da REDE ADVIR">
                    <InstagramIcon />
                  </SocialLink>
                )}
                {SOCIAL_LINKS.youtube && (
                  <SocialLink href={SOCIAL_LINKS.youtube} label="YouTube da REDE ADVIR">
                    <YouTubeIcon />
                  </SocialLink>
                )}
              </div>
            )}
          </div>

          {/* Columna de Red GMI */}
          <div>
            <h3 className="font-semibold mb-4">Rede GMI no Mundo</h3>
            <ul className="space-y-2 text-sm">
              {GMI_LINKS.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-text-secondary dark:hover:text-white transition-colors"
                  >
                    <BroadcastIcon />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna de políticas y enlaces */}
          <div>
            <h3 className="font-semibold mb-4">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <FooterLink href="/sobre">Sobre Nós</FooterLink>
              </li>
              <li>
                <FooterLink href="/doar">Doar</FooterLink>
              </li>
              {POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna de apps */}
          <div>
            <h3 className="font-semibold mb-4">Baixe o App</h3>
            <div className="flex flex-col gap-3">
              <AppStoreLink href={APP_LINKS.android} store="android" />
              <AppStoreLink href={APP_LINKS.ios} store="ios" />
            </div>

            {/* Aliado GMI */}
            <div className="mt-6">
              <a
                href={MINISTRY_INFO.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 dark:text-text-muted dark:hover:text-white transition-colors text-sm"
              >
                Aliado: {MINISTRY_INFO.name}
              </a>
            </div>
          </div>
        </div>

        {/* Versículo y copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-tv-border">
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Versículo */}
            <p className="text-brand-600 dark:text-brand-400 text-sm italic max-w-2xl">
              {SITE_VERSE}
            </p>

            {/* Copyright */}
            <p className="text-gray-500 dark:text-text-muted text-sm">
              © 2002–{currentYear} {SITE_LONG_NAME}. Avançando com voluntários junto a {MINISTRY_INFO.name}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
