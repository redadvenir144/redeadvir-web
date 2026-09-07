import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rede ADVIR',
  description: 'O canal da volta de Jesus',
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
