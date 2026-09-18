import Link from 'next/link';
import { requireUser } from '@/lib/auth/guard';
import { Panel } from '@/components/admin';
import {
  listPrograms,
  listVideos,
  listPages,
  listSlotsByDay,
} from '@/lib/admin/queries';
import { scheduleRepository } from '@/lib/data';
import { CHANNEL_TIMEZONE } from '@/lib/config/site';
import type { DayOfWeek } from '@/types/content';

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number | string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={[
        'block p-4 rounded-xl min-h-11',
        'bg-paper-raised dark:bg-tv-card',
        'border border-paper-border dark:border-tv-border',
        'hover:border-brand-400 dark:hover:border-brand-600/50 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
      ].join(' ')}
    >
      <span className="block text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
        {value}
      </span>
      <span className="block text-sm text-gray-600 dark:text-text-secondary mt-0.5">
        {label}
      </span>
    </Link>
  );
}

export default async function AdminHomePage() {
  const user = await requireUser();

  const today = new Date().getDay() as DayOfWeek;

  const [programs, videos, pages, todaySlots, currentSlot] = await Promise.all([
    listPrograms(),
    listVideos(),
    listPages(),
    listSlotsByDay(today),
    scheduleRepository.getCurrentSlot(),
  ]);

  const publishedVideos = videos.filter((video) => video.is_published).length;

  const nowLabel = currentSlot
    ? `${new Intl.DateTimeFormat('pt-BR', {
        timeZone: CHANNEL_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date(currentSlot.startTime))} · ${currentSlot.program.title}`
    : 'Nada programado neste horário';

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Olá, {user.name.split(' ')[0]}
        </h1>
        <p className="text-gray-600 dark:text-text-secondary mt-1">
          No ar agora: {nowLabel}
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Programas"
          value={programs.length}
          href="/admin/programas"
        />
        <StatCard
          label="Blocos hoje"
          value={todaySlots.length}
          href="/admin/grade"
        />
        <StatCard
          label="Vídeos publicados"
          value={publishedVideos}
          href="/admin/videos"
        />
        <StatCard label="Páginas" value={pages.length} href="/admin/paginas" />
      </div>

      <Panel
        title="Por onde começar"
        description="As tarefas mais comuns do dia a dia."
      >
        <ul className="space-y-3 text-sm">
          <li>
            <Link
              href="/admin/grade"
              className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
            >
              Editar a grade de programação
            </Link>
            <span className="text-gray-600 dark:text-text-secondary">
              {' '}— é o que muda com mais frequência. A grade é por dia da
              semana e pode ser copiada de um dia para os outros.
            </span>
          </li>
          <li>
            <Link
              href="/admin/videos"
              className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
            >
              Publicar um vídeo
            </Link>
            <span className="text-gray-600 dark:text-text-secondary">
              {' '}— aparece em /videos assim que for marcado como publicado.
            </span>
          </li>
          <li>
            <Link
              href="/admin/configuracao"
              className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
            >
              Trocar o endereço da transmissão
            </Link>
            <span className="text-gray-600 dark:text-text-secondary">
              {' '}— use com cuidado: um endereço errado tira o canal do ar no
              site.
            </span>
          </li>
        </ul>
      </Panel>
    </>
  );
}
