import type { Metadata } from 'next';
import { programsRepository, scheduleRepository } from '@/lib/data';
import { ProgramCard } from '@/features/programs';

export const metadata: Metadata = {
  title: 'Programas | REDE ADVIR',
  description:
    'Conheça os programas da REDE ADVIR: devocional, estudos bíblicos, música, documentários e muito mais. Confira os horários de exibição.',
  openGraph: {
    title: 'Programas | REDE ADVIR',
    description:
      'Conheça os programas da REDE ADVIR: devocional, estudos bíblicos, música, documentários e muito mais.',
    type: 'website',
  },
};

export default async function ProgramasPage() {
  const programs = await programsRepository.getAll();

  // Obtener horarios y estado live para cada programa
  const programsWithData = await Promise.all(
    programs.map(async (program) => {
      const [broadcastTimes, isLive] = await Promise.all([
        scheduleRepository.getBroadcastTimesForProgram(program.slug),
        scheduleRepository.isProgramLiveNow(program.slug),
      ]);
      return { program, broadcastTimes, isLive };
    })
  );

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Programas
        </h1>
        <p className="text-text-secondary">
          Conheça a programação da REDE ADVIR
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {programsWithData.map(({ program, broadcastTimes, isLive }) => (
          <ProgramCard
            key={program.id}
            program={program}
            broadcastTimes={broadcastTimes}
            isLive={isLive}
          />
        ))}
      </div>
    </main>
  );
}
