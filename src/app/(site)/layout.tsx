import { Header, Footer } from '@/components/layout';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: obtener el estado real del canal desde el repositorio
  const isChannelLive = true; // Mock: siempre "en vivo" por ahora

  return (
    <div className="flex min-h-screen flex-col">
      <Header isChannelLive={isChannelLive} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
