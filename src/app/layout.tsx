import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e3a5f',
};

export const metadata: Metadata = {
  title: 'REDE ADVIR',
  description: 'O canal da volta de Jesus',
  // TODO: Remover robots ao lançar no domínio final
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
