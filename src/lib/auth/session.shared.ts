/**
 * Constantes de sesión seguras para el Edge.
 *
 * Vive aparte de session.ts porque aquel importa `server-only` y el cliente de
 * Postgres, que no pueden cargarse en el middleware.
 */
export const SESSION_COOKIE = 'redeadvir_admin_session';
