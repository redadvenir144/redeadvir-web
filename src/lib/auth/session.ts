import 'server-only';
import { randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { requireSql } from '@/lib/db/client';
import { SESSION_COOKIE } from './session.shared';

export { SESSION_COOKIE };

/** Duración de la sesión: 7 días. */
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export type AdminRole = 'admin' | 'editor';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

interface SessionRow {
  user_id: string;
  email: string;
  name: string;
  role: AdminRole;
}

/**
 * Crea una sesión en la base de datos y deja la cookie.
 *
 * El identificador es un valor aleatorio de 256 bits, no un JWT: guardarlo en
 * la base de datos permite revocar el acceso de alguien al instante, cosa que
 * un token firmado sin estado no permite.
 */
export async function createSession(userId: string): Promise<void> {
  const sql = requireSql();
  const id = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await sql`
    INSERT INTO admin_sessions (id, user_id, expires_at)
    VALUES (${id}, ${userId}, ${expiresAt})
  `;

  cookies().set(SESSION_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

/**
 * Lee la sesión actual. Devuelve null si no hay cookie, si la sesión no existe
 * o si ya caducó. Nunca lanza: si la base de datos falla, el admin trata al
 * visitante como no autenticado en vez de romper la página.
 */
export async function getCurrentUser(): Promise<AdminUser | null> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  try {
    const sql = requireSql();
    const rows = await sql<SessionRow[]>`
      SELECT u.id AS user_id, u.email, u.name, u.role
      FROM admin_sessions s
      JOIN admin_users u ON u.id = s.user_id
      WHERE s.id = ${sessionId}
        AND s.expires_at > now()
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      id: row.user_id,
      email: row.email,
      name: row.name,
      role: row.role,
    };
  } catch (error) {
    console.error('[auth] Falha ao ler a sessão:', error);
    return null;
  }
}

/**
 * Cierra la sesión actual: la borra de la base de datos y quita la cookie.
 */
export async function destroySession(): Promise<void> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;

  if (sessionId) {
    try {
      const sql = requireSql();
      await sql`DELETE FROM admin_sessions WHERE id = ${sessionId}`;
    } catch (error) {
      console.error('[auth] Falha ao apagar a sessão:', error);
    }
  }

  cookies().delete(SESSION_COOKIE);
}

/** Borra las sesiones caducadas. Se llama al hacer login. */
export async function pruneExpiredSessions(): Promise<void> {
  try {
    const sql = requireSql();
    await sql`DELETE FROM admin_sessions WHERE expires_at <= now()`;
  } catch {
    // Limpieza oportunista: si falla, no afecta al login.
  }
}
