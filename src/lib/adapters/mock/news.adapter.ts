import type { Article } from '@/types/content';
import type { NewsRepository } from '@/lib/data/news.repository';
import { news } from '@/mocks/news';

export class MockNewsAdapter implements NewsRepository {
  async getAll(limit = 50): Promise<Article[]> {
    return [...news]
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
      .slice(0, limit);
  }

  async getBySlug(slug: string): Promise<Article | null> {
    return news.find((article) => article.slug === slug) ?? null;
  }
}
