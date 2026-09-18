import 'server-only';
import type { Video } from '@/types/content';
import type { VideosRepository } from '@/lib/data/videos.repository';
import { requireSql } from '@/lib/db/client';
import { toVideo, type VideoRow } from './rows';

const SELECT_VIDEO = `
  SELECT
    v.id, v.slug, v.title, v.description,
    v.category_id, c.slug AS category_slug, c.name AS category_name,
    v.url, v.thumbnail_src, v.thumbnail_alt,
    v.duration_seconds, v.published_at
  FROM videos v
  LEFT JOIN categories c ON c.id = v.category_id
`;

export class PostgresVideosAdapter implements VideosRepository {
  async getAll(): Promise<Video[]> {
    const sql = requireSql();
    const rows = await sql<VideoRow[]>`
      ${sql.unsafe(SELECT_VIDEO)}
      WHERE v.is_published = true
      ORDER BY v.published_at DESC
    `;
    return rows.map(toVideo);
  }

  async getBySlug(slug: string): Promise<Video | null> {
    const sql = requireSql();
    const rows = await sql<VideoRow[]>`
      ${sql.unsafe(SELECT_VIDEO)}
      WHERE v.slug = ${slug} AND v.is_published = true
      LIMIT 1
    `;
    const row = rows[0];
    return row ? toVideo(row) : null;
  }

  async getCategories(): Promise<string[]> {
    const sql = requireSql();
    const rows = await sql<{ name: string }[]>`
      SELECT DISTINCT c.name
      FROM videos v
      JOIN categories c ON c.id = v.category_id
      WHERE v.is_published = true
      ORDER BY c.name ASC
    `;
    return rows.map((row) => row.name);
  }
}
