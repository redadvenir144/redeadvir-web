import { LivePlayer, NowNextBar } from '@/features/live';

export default function HomePage() {
  return (
    <main className="max-w-screen-2xl mx-auto px-4 py-6">
      {/* Layout: en desktop player 2/3 + sidebar 1/3, en móvil apilado */}
      <div className="flex flex-col lg:flex-row lg:gap-6">
        {/* Reproductor en vivo - 2/3 en desktop */}
        <div className="lg:w-2/3">
          <LivePlayer fallbackContent={<NowNextBar />} />
        </div>

        {/* Sidebar con programación - 1/3 en desktop */}
        <aside className="mt-6 lg:mt-0 lg:w-1/3">
          <NowNextBar />
        </aside>
      </div>
    </main>
  );
}
