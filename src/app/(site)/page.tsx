import { LivePlayer, NowNextBar } from '@/features/live';
import { ScheduleListPreview } from '@/features/schedule';
import { SmartTVSection, ChannelStrip } from '@/components/sections';
import { settingsRepository, scheduleRepository } from '@/lib/data';
import { SITE_LONG_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/config/site';
import { JsonLd, graph, liveVideoJsonLd } from '@/lib/seo';

/**
 * La home muestra qué está en el aire ahora mismo, así que no puede servirse
 * prerenderizada: se revalida cada minuto y se refresca sola tras editar la
 * grade en el admin.
 */
export const revalidate = 60;

export default async function HomePage() {
  const [streamUrl, currentSlot] = await Promise.all([
    settingsRepository.get('stream_url'),
    scheduleRepository.getCurrentSlot(),
  ]);

  // El directo es 24/7: si no hay bloque en emisión, se ancla el inicio a la
  // medianoche de hoy en vez de omitir el dato.
  const startDate =
    currentSlot?.startTime ?? new Date().toISOString();

  return (
    <main className="-mt-[72px]">
      <JsonLd
        data={graph(
          liveVideoJsonLd({
            startDate,
            thumbnailUrl: `${SITE_URL}/images/og-image.jpg`,
            currentProgramTitle: currentSlot?.program.title,
          }),
        )}
      />

      {/*
        El h1 es invisible pero está: el héroe de la página es el reproductor,
        y un titular encima empujaría el directo fuera de la primera pantalla.
        Sin él, la página más importante del sitio no declaraba de qué va.
      */}
      <h1 className="sr-only">
        {SITE_LONG_NAME} ao vivo — {SITE_TAGLINE}
      </h1>

      {/* Hero: Player en vivo - ocupa casi toda la pantalla */}
      <section className="relative" aria-label="Transmissão ao vivo">
        {/* El padding compensa la altura del header (72px, fijo) y suma un
            respiro para que el reproductor no quede pegado a la barra. */}
        <div className="pt-[88px] sm:pt-[96px]">
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <LivePlayer
              streamUrl={streamUrl ?? undefined}
              poster="/images/poster-live.jpg"
              fallbackContent={<NowNextBar showScheduleLink={false} />}
            />
          </div>

          {/* Como sintonizar: TV aberta y satélite */}
          <ChannelStrip />

          {/* Agora / A seguir, pegado al directo */}
          <div className="max-w-6xl mx-auto px-4 lg:px-8 mt-6">
            <NowNextBar showScheduleLink={false} />
          </div>
        </div>
      </section>

      {/* Grade del día */}
      <ScheduleListPreview />

      {/* Smart TV / Apps */}
      <SmartTVSection />
    </main>
  );
}
