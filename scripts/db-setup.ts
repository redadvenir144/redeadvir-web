/**
 * Prepara la base de datos del admin.
 *
 *   npm run db:setup                     -> crea tablas y siembra desde mocks/
 *   npm run db:setup -- --reset          -> borra todo antes de crear
 *   npm run db:admin -- email senha Nome -> crea el primer usuario admin
 *
 * Es idempotente: ejecutarlo dos veces no duplica contenido.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID, scrypt, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';
import postgres from 'postgres';

import { programs } from '../src/mocks/programs';
import { dailySchedule } from '../src/mocks/schedule';
import { videos } from '../src/mocks/videos';
import { pages } from '../src/mocks/pages';

const scryptAsync = promisify(scrypt);

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error(
    '\n  DATABASE_URL não está definida.\n' +
      '  Adicione-a em .env.local antes de rodar este script.\n',
  );
  process.exit(1);
}

const isLocal =
  connectionString.includes('localhost') ||
  connectionString.includes('127.0.0.1');

const sql = postgres(connectionString, {
  ssl: isLocal ? false : 'require',
  max: 1,
  // "CREATE TABLE IF NOT EXISTS" avisa por cada tabla que ya existe.
  // Es ruido esperado en un script idempotente.
  onnotice: () => {},
});

async function hash(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString('hex')}`;
}

async function dropAll(): Promise<void> {
  console.log('  Apagando tabelas existentes…');
  await sql`
    DROP TABLE IF EXISTS
      admin_sessions, admin_users, schedule_slots,
      videos, programs, categories, pages, site_settings
    CASCADE
  `;
}

async function applySchema(): Promise<void> {
  const schemaPath = join(process.cwd(), 'src', 'lib', 'db', 'schema.sql');
  const schema = readFileSync(schemaPath, 'utf8');
  await sql.unsafe(schema);
  console.log('  Esquema aplicado.');
}

async function seed(): Promise<void> {
  const existing = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count FROM programs
  `;
  if ((existing[0]?.count ?? 0) > 0) {
    console.log('  Já existe conteúdo — semeadura ignorada.');
    return;
  }

  // Categorías de los programas y de los vídeos, sin duplicar por slug.
  const categories = new Map<string, { id: string; name: string }>();
  for (const program of programs) {
    categories.set(program.category.slug, {
      id: program.category.id,
      name: program.category.name,
    });
  }
  for (const video of videos) {
    if (video.category && !categories.has(video.category.slug)) {
      categories.set(video.category.slug, {
        id: video.category.id,
        name: video.category.name,
      });
    }
  }

  for (const [slug, category] of categories) {
    await sql`
      INSERT INTO categories (id, slug, name)
      VALUES (${category.id}, ${slug}, ${category.name})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log(`  ${categories.size} categorias.`);

  for (const program of programs) {
    await sql`
      INSERT INTO programs (
        id, slug, title, description, category_id,
        thumbnail_src, thumbnail_alt, thumbnail_width, thumbnail_height,
        duration_minutes
      ) VALUES (
        ${program.id}, ${program.slug}, ${program.title}, ${program.description},
        ${program.category.id}, ${program.thumbnail.src}, ${program.thumbnail.alt},
        ${program.thumbnail.width}, ${program.thumbnail.height},
        ${program.durationMinutes}
      )
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log(`  ${programs.length} programas.`);

  // La grilla mock es idéntica los 7 días: se replica en cada día de la semana.
  const programIdBySlug = new Map(programs.map((p) => [p.slug, p.id]));
  let slotCount = 0;
  for (let day = 0; day <= 6; day++) {
    for (const raw of dailySchedule) {
      const programId = programIdBySlug.get(raw.programSlug);
      if (!programId) continue;
      await sql`
        INSERT INTO schedule_slots (
          id, program_id, day_of_week, start_hour, start_minute, duration_minutes
        ) VALUES (
          ${randomUUID()}, ${programId}, ${day},
          ${raw.startHour}, ${raw.startMinute}, ${raw.durationMinutes}
        )
        ON CONFLICT (day_of_week, start_hour, start_minute) DO NOTHING
      `;
      slotCount++;
    }
  }
  console.log(`  ${slotCount} blocos de grade (7 dias).`);

  // La categoría puede existir ya con otro id (p. ej. "musica" viene de los
  // programas), así que se resuelve por slug contra lo que quedó en la tabla.
  const categoryIdBySlug = new Map(
    (
      await sql<{ id: string; slug: string }[]>`SELECT id, slug FROM categories`
    ).map((row) => [row.slug, row.id]),
  );

  for (const video of videos) {
    const categoryId = video.category
      ? (categoryIdBySlug.get(video.category.slug) ?? null)
      : null;

    await sql`
      INSERT INTO videos (
        id, slug, title, description, category_id, url,
        thumbnail_src, thumbnail_alt, duration_seconds, published_at
      ) VALUES (
        ${video.id}, ${video.slug}, ${video.title}, ${video.description},
        ${categoryId}, ${video.url},
        ${video.thumbnail?.src ?? ''}, ${video.thumbnail?.alt ?? ''},
        ${video.durationSeconds}, ${video.publishedAt}
      )
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log(`  ${videos.length} vídeos.`);

  for (const page of pages) {
    await sql`
      INSERT INTO pages (slug, title, description, body)
      VALUES (${page.slug}, ${page.title}, ${page.description}, ${page.body})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log(`  ${pages.length} páginas.`);
}

async function createAdminUser(
  email: string,
  password: string,
  name: string,
): Promise<void> {
  const passwordHash = await hash(password);
  await sql`
    INSERT INTO admin_users (id, email, name, password_hash, role)
    VALUES (${randomUUID()}, ${email.toLowerCase()}, ${name}, ${passwordHash}, 'admin')
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
  `;
  console.log(`\n  Usuário admin pronto: ${email}\n`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args[0] === '--user') {
    const [, email, password, ...nameParts] = args;
    if (!email || !password) {
      console.error(
        '\n  Uso: npm run db:admin -- email@exemplo.com senha Nome Completo\n',
      );
      process.exit(1);
    }
    if (password.length < 8) {
      console.error('\n  A senha precisa ter pelo menos 8 caracteres.\n');
      process.exit(1);
    }
    await createAdminUser(email, password, nameParts.join(' ') || 'Administrador');
    return;
  }

  console.log('\n  Preparando banco de dados…\n');
  if (args.includes('--reset')) await dropAll();
  await applySchema();
  await seed();
  console.log('\n  Pronto. Crie o primeiro usuário com:');
  console.log('  npm run db:admin -- email@exemplo.com suasenha Seu Nome\n');
}

main()
  .catch((error) => {
    console.error('\n  Falhou:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => sql.end());
