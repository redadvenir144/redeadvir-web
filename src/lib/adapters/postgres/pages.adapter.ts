import 'server-only';
import type { Page } from '@/types/content';
import type { PagesRepository } from '@/lib/data/pages.repository';
import { requireSql } from '@/lib/db/client';
import { toPage, type PageRow } from './rows';

export class PostgresPagesAdapter implements PagesRepository {
  async getBySlug(slug: string): Promise<Page | null> {
    const sql = requireSql();
    const rows = await sql<PageRow[]>`
      SELECT slug, title, description, body, updated_at
      FROM pages
      WHERE slug = ${slug} AND is_published = true
      LIMIT 1
    `;
    const row = rows[0];
    return row ? toPage(row) : null;
  }

  async getAll(): Promise<Page[]> {
    const sql = requireSql();
    const rows = await sql<PageRow[]>`
      SELECT slug, title, description, body, updated_at
      FROM pages
      WHERE is_published = true
      ORDER BY title ASC
    `;
    return rows.map(toPage);
  }
}
