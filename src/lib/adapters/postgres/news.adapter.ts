import 'server-only';
import type { Article } from '@/types/content';
import type { NewsRepository } from '@/lib/data/news.repository';
import { requireSql } from '@/lib/db/client';
import { toArticle, type ArticleRow } from './rows';

const SELECT_NEWS = `
  SELECT
    n.id, n.slug, n.title, n.excerpt, n.body, n.author,
    n.category_id, c.slug AS category_slug, c.name AS category_name,
    n.thumbnail_src, n.thumbnail_alt,
    n.published_at, n.updated_at
  FROM news n
  LEFT JOIN categories c ON c.id = n.category_id
`;

export class PostgresNewsAdapter implements NewsRepository {
  async getAll(limit = 50): Promise<Article[]> {
    const sql = requireSql();
    const rows = await sql<ArticleRow[]>`
      ${sql.unsafe(SELECT_NEWS)}
      WHERE n.is_published = true
      ORDER BY n.published_at DESC
      LIMIT ${limit}
    `;
    return rows.map(toArticle);
  }

  async getBySlug(slug: string): Promise<Article | null> {
    const sql = requireSql();
    const rows = await sql<ArticleRow[]>`
      ${sql.unsafe(SELECT_NEWS)}
      WHERE n.slug = ${slug} AND n.is_published = true
      LIMIT 1
    `;
    const row = rows[0];
    return row ? toArticle(row) : null;
  }
}
