import { LivePlayer, NowNextBar } from '@/features/live';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Reproductor en vivo */}
      <LivePlayer
        fallbackContent={<NowNextBar />}
      />

      {/* Barra de programación actual/siguiente */}
      <div className="mt-6">
        <NowNextBar />
      </div>
    </div>
  );
}
