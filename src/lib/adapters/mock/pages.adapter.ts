import type { Page } from '@/types/content';
import type { PagesRepository } from '@/lib/data/pages.repository';
import { pages } from '@/mocks/pages';

export class MockPagesAdapter implements PagesRepository {
  async getBySlug(slug: string): Promise<Page | null> {
    return pages.find((page) => page.slug === slug) ?? null;
  }

  async getAll(): Promise<Page[]> {
    return [...pages];
  }
}
