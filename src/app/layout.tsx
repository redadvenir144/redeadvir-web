import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import {
  SITE_NAME,
  SITE_LONG_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
} from '@/lib/config/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_LONG_NAME} — TV cristã ao vivo`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: SITE_LONG_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_LONG_NAME,
    description: SITE_DESCRIPTION,
  },
  // Iconos por convención de archivos: app/favicon.ico, app/icon.png, app/apple-icon.png
  // TODO: Remover robots al lanzar en el dominio final
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e3a5f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
