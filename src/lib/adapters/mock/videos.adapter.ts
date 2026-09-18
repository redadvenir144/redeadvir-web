import type { Video } from '@/types/content';
import type { VideosRepository } from '@/lib/data/videos.repository';
import { videos } from '@/mocks/videos';

export class MockVideosAdapter implements VideosRepository {
  async getAll(): Promise<Video[]> {
    return [...videos].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }

  async getBySlug(slug: string): Promise<Video | null> {
    return videos.find((video) => video.slug === slug) ?? null;
  }

  async getCategories(): Promise<string[]> {
    const names = new Set<string>();
    for (const video of videos) {
      if (video.category) names.add(video.category.name);
    }
    return [...names].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }
}
