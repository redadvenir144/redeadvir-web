import type { Program } from '@/types/content';
import type { ProgramsRepository } from '@/lib/data/programs.repository';
import { programs } from '@/mocks/programs';

export class MockProgramsAdapter implements ProgramsRepository {
  async getAll(): Promise<Program[]> {
    return programs;
  }

  async getBySlug(slug: string): Promise<Program | null> {
    return programs.find((p) => p.slug === slug) ?? null;
  }
}
