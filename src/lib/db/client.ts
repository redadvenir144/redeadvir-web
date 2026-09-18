import 'server-only';
import postgres from 'postgres';

/**
 * Cliente de Postgres.
 *
 * `DATABASE_URL` es una variable de servidor: nunca lleva prefijo NEXT_PUBLIC_
 * y no debe importarse desde un Client Component. El `server-only` de arriba
 * hace que el build falle si alguien lo intenta.
 *
 * Si no hay `DATABASE_URL`, `sql` es `null` y el sitio cae al adaptador mock.
 * Así la web pública sigue funcionando aunque la base de datos no esté lista.
 */

const connectionString = process.env.DATABASE_URL;

/** Si la base de datos está configurada. */
export const isDatabaseConfigured = Boolean(connectionString);

declare global {
  // eslint-disable-next-line no-var
  var __redeadvirSql: postgres.Sql | undefined;
}

function createClient(): postgres.Sql | null {
  if (!connectionString) return null;

  // Los servicios gestionados (Neon, Supabase) exigen TLS; un Postgres local
  // normalmente no lo tiene habilitado.
  const isLocal =
    connectionString.includes('localhost') ||
    connectionString.includes('127.0.0.1');

  return postgres(connectionString, {
    ssl: isLocal ? false : 'require',
    // En serverless cada instancia atiende pocas peticiones a la vez.
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

// En desarrollo, Next recarga los módulos en cada cambio. Sin este caché
// global se abriría una conexión nueva en cada recarga hasta agotar el pool.
export const sql: postgres.Sql | null =
  globalThis.__redeadvirSql ?? createClient();

if (process.env.NODE_ENV !== 'production' && sql) {
  globalThis.__redeadvirSql = sql;
}

/**
 * Devuelve el cliente o lanza si no hay base de datos.
 * Úsalo en el admin, donde operar sin base de datos no tiene sentido.
 */
export function requireSql(): postgres.Sql {
  if (!sql) {
    throw new Error(
      'DATABASE_URL não está configurada. O painel administrativo precisa de banco de dados.',
    );
  }
  return sql;
}
