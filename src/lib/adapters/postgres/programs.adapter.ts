import 'server-only';
import type { Program } from '@/types/content';
import type { ProgramsRepository } from '@/lib/data/programs.repository';
import { requireSql } from '@/lib/db/client';
import { toProgram, type ProgramRow } from './rows';

const SELECT_PROGRAM = `
  SELECT
    p.id, p.slug, p.title, p.description,
    p.category_id, c.slug AS category_slug, c.name AS category_name,
    p.thumbnail_src, p.thumbnail_alt, p.thumbnail_width, p.thumbnail_height,
    p.duration_minutes
  FROM programs p
  JOIN categories c ON c.id = p.category_id
`;

export class PostgresProgramsAdapter implements ProgramsRepository {
  async getAll(): Promise<Program[]> {
    const sql = requireSql();
    const rows = await sql<ProgramRow[]>`
      ${sql.unsafe(SELECT_PROGRAM)}
      ORDER BY p.title ASC
    `;
    return rows.map(toProgram);
  }

  async getBySlug(slug: string): Promise<Program | null> {
    const sql = requireSql();
    const rows = await sql<ProgramRow[]>`
      ${sql.unsafe(SELECT_PROGRAM)}
      WHERE p.slug = ${slug}
      LIMIT 1
    `;
    const row = rows[0];
    return row ? toProgram(row) : null;
  }
}
