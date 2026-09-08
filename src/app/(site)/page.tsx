import { LivePlayer, NowNextBar } from '@/features/live';

export default function HomePage() {
  return (
    <main className="-mt-[72px]">
      {/* Hero: Player en vivo - ocupa casi toda la pantalla */}
      <section className="relative">
        {/* Player full-width con padding para el header */}
        <div className="pt-[72px]">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <LivePlayer fallbackContent={<NowNextBar />} />
          </div>
        </div>
      </section>

      {/* Programación actual */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Programação
          </h2>
          <p className="text-text-secondary mt-1">
            O que está passando e o que vem a seguir
          </p>
        </header>
        <NowNextBar />
      </section>
    </main>
  );
}
