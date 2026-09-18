import 'server-only';
import { randomUUID } from 'node:crypto';
import { requireSql } from '@/lib/db/client';
import type { DayOfWeek } from '@/types/content';
import type { SettingKey, SettingsMap } from '@/lib/data/settings.repository';
import type { AdminRole } from '@/lib/auth/session';

/**
 * Consultas del panel administrativo.
 *
 * Están separadas de `lib/adapters/postgres/` a propósito: aquellos implementan
 * el contrato de lectura que consume la web pública; estas son las operaciones
 * de escritura que solo el admin usa. Mezclarlas obligaría a meter métodos de
 * escritura en la interfaz pública de los repositorios.
 */

// ---------------------------------------------------------------------------
// Categorías
// ---------------------------------------------------------------------------

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
}

export async function listCategories(): Promise<AdminCategory[]> {
  const sql = requireSql();
  return sql<AdminCategory[]>`
    SELECT id, slug, name FROM categories ORDER BY name ASC
  `;
}

export async function createCategory(
  slug: string,
  name: string,
): Promise<string> {
  const sql = requireSql();
  const id = randomUUID();
  await sql`
    INSERT INTO categories (id, slug, name) VALUES (${id}, ${slug}, ${name})
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  `;
  return id;
}

// ---------------------------------------------------------------------------
// Programas
// ---------------------------------------------------------------------------

export interface AdminProgram {
  id: string;
  slug: string;
  title: string;
  description: string;
  category_id: string;
  category_name: string;
  thumbnail_src: string;
  thumbnail_alt: string;
  duration_minutes: number;
  slot_count: number;
}

export async function listPrograms(): Promise<AdminProgram[]> {
  const sql = requireSql();
  return sql<AdminProgram[]>`
    SELECT
      p.id, p.slug, p.title, p.description,
      p.category_id, c.name AS category_name,
      p.thumbnail_src, p.thumbnail_alt, p.duration_minutes,
      COUNT(s.id)::int AS slot_count
    FROM programs p
    JOIN categories c ON c.id = p.category_id
    LEFT JOIN schedule_slots s ON s.program_id = p.id
    GROUP BY p.id, c.name
    ORDER BY p.title ASC
  `;
}

export async function getProgram(id: string): Promise<AdminProgram | null> {
  const sql = requireSql();
  const rows = await sql<AdminProgram[]>`
    SELECT
      p.id, p.slug, p.title, p.description,
      p.category_id, c.name AS category_name,
      p.thumbnail_src, p.thumbnail_alt, p.duration_minutes,
      0 AS slot_count
    FROM programs p
    JOIN categories c ON c.id = p.category_id
    WHERE p.id = ${id}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export interface ProgramInput {
  slug: string;
  title: string;
  description: string;
  categoryId: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  durationMinutes: number;
}

export async function createProgram(input: ProgramInput): Promise<string> {
  const sql = requireSql();
  const id = randomUUID();
  await sql`
    INSERT INTO programs (
      id, slug, title, description, category_id,
      thumbnail_src, thumbnail_alt, duration_minutes
    ) VALUES (
      ${id}, ${input.slug}, ${input.title}, ${input.description},
      ${input.categoryId}, ${input.thumbnailSrc}, ${input.thumbnailAlt},
      ${input.durationMinutes}
    )
  `;
  return id;
}

export async function updateProgram(
  id: string,
  input: ProgramInput,
): Promise<void> {
  const sql = requireSql();
  await sql`
    UPDATE programs SET
      slug = ${input.slug},
      title = ${input.title},
      description = ${input.description},
      category_id = ${input.categoryId},
      thumbnail_src = ${input.thumbnailSrc},
      thumbnail_alt = ${input.thumbnailAlt},
      duration_minutes = ${input.durationMinutes},
      updated_at = now()
    WHERE id = ${id}
  `;
}

export async function deleteProgram(id: string): Promise<void> {
  const sql = requireSql();
  // Los bloques de grilla caen con el programa (ON DELETE CASCADE).
  await sql`DELETE FROM programs WHERE id = ${id}`;
}

/** Cuántos bloques de grilla dejaría huérfanos borrar este programa. */
export async function countSlotsForProgram(id: string): Promise<number> {
  const sql = requireSql();
  const rows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count FROM schedule_slots WHERE program_id = ${id}
  `;
  return rows[0]?.count ?? 0;
}

// ---------------------------------------------------------------------------
// Grilla
// ---------------------------------------------------------------------------

export interface AdminSlot {
  id: string;
  program_id: string;
  program_title: string;
  day_of_week: DayOfWeek;
  start_hour: number;
  start_minute: number;
  duration_minutes: number;
}

export async function listSlotsByDay(day: DayOfWeek): Promise<AdminSlot[]> {
  const sql = requireSql();
  return sql<AdminSlot[]>`
    SELECT
      s.id, s.program_id, p.title AS program_title,
      s.day_of_week, s.start_hour, s.start_minute, s.duration_minutes
    FROM schedule_slots s
    JOIN programs p ON p.id = s.program_id
    WHERE s.day_of_week = ${day}
    ORDER BY s.start_hour ASC, s.start_minute ASC
  `;
}

export interface SlotInput {
  programId: string;
  dayOfWeek: DayOfWeek;
  startHour: number;
  startMinute: number;
  durationMinutes: number;
}

export async function createSlot(input: SlotInput): Promise<string> {
  const sql = requireSql();
  const id = randomUUID();
  await sql`
    INSERT INTO schedule_slots (
      id, program_id, day_of_week, start_hour, start_minute, duration_minutes
    ) VALUES (
      ${id}, ${input.programId}, ${input.dayOfWeek},
      ${input.startHour}, ${input.startMinute}, ${input.durationMinutes}
    )
  `;
  return id;
}

export async function updateSlot(id: string, input: SlotInput): Promise<void> {
  const sql = requireSql();
  await sql`
    UPDATE schedule_slots SET
      program_id = ${input.programId},
      day_of_week = ${input.dayOfWeek},
      start_hour = ${input.startHour},
      start_minute = ${input.startMinute},
      duration_minutes = ${input.durationMinutes}
    WHERE id = ${id}
  `;
}

export async function deleteSlot(id: string): Promise<void> {
  const sql = requireSql();
  await sql`DELETE FROM schedule_slots WHERE id = ${id}`;
}

/**
 * Copia la grilla de un día sobre otro, reemplazándola.
 * El cliente arma un día y lo replica en los demás sin repetir el trabajo.
 */
export async function copyDaySchedule(
  fromDay: DayOfWeek,
  toDays: DayOfWeek[],
): Promise<number> {
  if (toDays.length === 0) return 0;
  const sql = requireSql();

  const source = await listSlotsByDay(fromDay);
  const targets = toDays.filter((day) => day !== fromDay);
  if (targets.length === 0) return 0;

  await sql.begin(async (tx) => {
    await tx`DELETE FROM schedule_slots WHERE day_of_week = ANY(${targets})`;

    for (const day of targets) {
      for (const slot of source) {
        await tx`
          INSERT INTO schedule_slots (
            id, program_id, day_of_week, start_hour, start_minute, duration_minutes
          ) VALUES (
            ${randomUUID()}, ${slot.program_id}, ${day},
            ${slot.start_hour}, ${slot.start_minute}, ${slot.duration_minutes}
          )
        `;
      }
    }
  });

  return targets.length * source.length;
}

// ---------------------------------------------------------------------------
// Vídeos
// ---------------------------------------------------------------------------

export interface AdminVideo {
  id: string;
  slug: string;
  title: string;
  description: string;
  category_id: string | null;
  category_name: string | null;
  url: string;
  thumbnail_src: string;
  thumbnail_alt: string;
  duration_seconds: number;
  published_at: Date;
  is_published: boolean;
}

export async function listVideos(): Promise<AdminVideo[]> {
  const sql = requireSql();
  return sql<AdminVideo[]>`
    SELECT
      v.id, v.slug, v.title, v.description,
      v.category_id, c.name AS category_name,
      v.url, v.thumbnail_src, v.thumbnail_alt,
      v.duration_seconds, v.published_at, v.is_published
    FROM videos v
    LEFT JOIN categories c ON c.id = v.category_id
    ORDER BY v.published_at DESC
  `;
}

export async function getVideo(id: string): Promise<AdminVideo | null> {
  const sql = requireSql();
  const rows = await sql<AdminVideo[]>`
    SELECT
      v.id, v.slug, v.title, v.description,
      v.category_id, c.name AS category_name,
      v.url, v.thumbnail_src, v.thumbnail_alt,
      v.duration_seconds, v.published_at, v.is_published
    FROM videos v
    LEFT JOIN categories c ON c.id = v.category_id
    WHERE v.id = ${id}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export interface VideoInput {
  slug: string;
  title: string;
  description: string;
  categoryId: string | null;
  url: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  durationSeconds: number;
  publishedAt: Date;
  isPublished: boolean;
}

export async function createVideo(input: VideoInput): Promise<string> {
  const sql = requireSql();
  const id = randomUUID();
  await sql`
    INSERT INTO videos (
      id, slug, title, description, category_id, url,
      thumbnail_src, thumbnail_alt, duration_seconds, published_at, is_published
    ) VALUES (
      ${id}, ${input.slug}, ${input.title}, ${input.description},
      ${input.categoryId}, ${input.url}, ${input.thumbnailSrc},
      ${input.thumbnailAlt}, ${input.durationSeconds},
      ${input.publishedAt}, ${input.isPublished}
    )
  `;
  return id;
}

export async function updateVideo(
  id: string,
  input: VideoInput,
): Promise<void> {
  const sql = requireSql();
  await sql`
    UPDATE videos SET
      slug = ${input.slug},
      title = ${input.title},
      description = ${input.description},
      category_id = ${input.categoryId},
      url = ${input.url},
      thumbnail_src = ${input.thumbnailSrc},
      thumbnail_alt = ${input.thumbnailAlt},
      duration_seconds = ${input.durationSeconds},
      published_at = ${input.publishedAt},
      is_published = ${input.isPublished},
      updated_at = now()
    WHERE id = ${id}
  `;
}

export async function deleteVideo(id: string): Promise<void> {
  const sql = requireSql();
  await sql`DELETE FROM videos WHERE id = ${id}`;
}

// ---------------------------------------------------------------------------
// Páginas
// ---------------------------------------------------------------------------

export interface AdminPage {
  slug: string;
  title: string;
  description: string;
  body: string;
  is_published: boolean;
  updated_at: Date;
}

export async function listPages(): Promise<AdminPage[]> {
  const sql = requireSql();
  return sql<AdminPage[]>`
    SELECT slug, title, description, body, is_published, updated_at
    FROM pages ORDER BY title ASC
  `;
}

export async function getPage(slug: string): Promise<AdminPage | null> {
  const sql = requireSql();
  const rows = await sql<AdminPage[]>`
    SELECT slug, title, description, body, is_published, updated_at
    FROM pages WHERE slug = ${slug} LIMIT 1
  `;
  return rows[0] ?? null;
}

export interface PageInput {
  slug: string;
  title: string;
  description: string;
  body: string;
  isPublished: boolean;
}

export async function upsertPage(input: PageInput): Promise<void> {
  const sql = requireSql();
  await sql`
    INSERT INTO pages (slug, title, description, body, is_published, updated_at)
    VALUES (
      ${input.slug}, ${input.title}, ${input.description},
      ${input.body}, ${input.isPublished}, now()
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      body = EXCLUDED.body,
      is_published = EXCLUDED.is_published,
      updated_at = now()
  `;
}

export async function deletePage(slug: string): Promise<void> {
  const sql = requireSql();
  await sql`DELETE FROM pages WHERE slug = ${slug}`;
}

// ---------------------------------------------------------------------------
// Configuración
// ---------------------------------------------------------------------------

export async function getAllSettings(): Promise<SettingsMap> {
  const sql = requireSql();
  const rows = await sql<{ key: string; value: string }[]>`
    SELECT key, value FROM site_settings
  `;
  const map: SettingsMap = {};
  for (const row of rows) {
    map[row.key as SettingKey] = row.value;
  }
  return map;
}

export async function saveSettings(entries: SettingsMap): Promise<void> {
  const sql = requireSql();
  const pairs = Object.entries(entries) as [SettingKey, string][];
  if (pairs.length === 0) return;

  await sql.begin(async (tx) => {
    for (const [key, value] of pairs) {
      await tx`
        INSERT INTO site_settings (key, value, updated_at)
        VALUES (${key}, ${value}, now())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
      `;
    }
  });
}

// ---------------------------------------------------------------------------
// Usuarios
// ---------------------------------------------------------------------------

export interface AdminUserRow {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  created_at: Date;
}

export async function listUsers(): Promise<AdminUserRow[]> {
  const sql = requireSql();
  return sql<AdminUserRow[]>`
    SELECT id, email, name, role, created_at
    FROM admin_users ORDER BY created_at ASC
  `;
}

export async function findUserByEmail(email: string): Promise<{
  id: string;
  password_hash: string;
} | null> {
  const sql = requireSql();
  const rows = await sql<{ id: string; password_hash: string }[]>`
    SELECT id, password_hash FROM admin_users
    WHERE lower(email) = lower(${email}) LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function createUser(
  email: string,
  name: string,
  passwordHash: string,
  role: AdminRole,
): Promise<string> {
  const sql = requireSql();
  const id = randomUUID();
  await sql`
    INSERT INTO admin_users (id, email, name, password_hash, role)
    VALUES (${id}, ${email.toLowerCase()}, ${name}, ${passwordHash}, ${role})
  `;
  return id;
}

export async function updateUserPassword(
  id: string,
  passwordHash: string,
): Promise<void> {
  const sql = requireSql();
  await sql`
    UPDATE admin_users SET password_hash = ${passwordHash} WHERE id = ${id}
  `;
  // Al cambiar la contraseña se cierran las sesiones abiertas de ese usuario.
  await sql`DELETE FROM admin_sessions WHERE user_id = ${id}`;
}

export async function deleteUser(id: string): Promise<void> {
  const sql = requireSql();
  await sql`DELETE FROM admin_users WHERE id = ${id}`;
}

export async function countAdmins(): Promise<number> {
  const sql = requireSql();
  const rows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count FROM admin_users WHERE role = 'admin'
  `;
  return rows[0]?.count ?? 0;
}

// ---------------------------------------------------------------------------
// Notícias
// ---------------------------------------------------------------------------

export interface AdminArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  category_id: string | null;
  category_name: string | null;
  thumbnail_src: string;
  thumbnail_alt: string;
  published_at: Date;
  is_published: boolean;
}

export async function listArticles(): Promise<AdminArticle[]> {
  const sql = requireSql();
  return sql<AdminArticle[]>`
    SELECT
      n.id, n.slug, n.title, n.excerpt, n.body, n.author,
      n.category_id, c.name AS category_name,
      n.thumbnail_src, n.thumbnail_alt,
      n.published_at, n.is_published
    FROM news n
    LEFT JOIN categories c ON c.id = n.category_id
    ORDER BY n.published_at DESC
  `;
}

export interface ArticleInput {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  categoryId: string | null;
  thumbnailSrc: string;
  thumbnailAlt: string;
  publishedAt: Date;
  isPublished: boolean;
}

export async function createArticle(input: ArticleInput): Promise<string> {
  const sql = requireSql();
  const id = randomUUID();
  await sql`
    INSERT INTO news (
      id, slug, title, excerpt, body, author, category_id,
      thumbnail_src, thumbnail_alt, published_at, is_published
    ) VALUES (
      ${id}, ${input.slug}, ${input.title}, ${input.excerpt}, ${input.body},
      ${input.author}, ${input.categoryId}, ${input.thumbnailSrc},
      ${input.thumbnailAlt}, ${input.publishedAt}, ${input.isPublished}
    )
  `;
  return id;
}

export async function updateArticle(
  id: string,
  input: ArticleInput,
): Promise<void> {
  const sql = requireSql();
  await sql`
    UPDATE news SET
      slug = ${input.slug},
      title = ${input.title},
      excerpt = ${input.excerpt},
      body = ${input.body},
      author = ${input.author},
      category_id = ${input.categoryId},
      thumbnail_src = ${input.thumbnailSrc},
      thumbnail_alt = ${input.thumbnailAlt},
      published_at = ${input.publishedAt},
      is_published = ${input.isPublished},
      updated_at = now()
    WHERE id = ${id}
  `;
}

export async function deleteArticle(id: string): Promise<void> {
  const sql = requireSql();
  await sql`DELETE FROM news WHERE id = ${id}`;
}
