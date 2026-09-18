/**
 * Degradación a los datos mock cuando la base de datos falla.
 *
 * El producto principal es la transmisión en vivo y la regla del proyecto es
 * que el usuario nunca se quede sin contenido. Si Postgres no responde —caída
 * del proveedor, red, credenciales rotadas— la web pública sigue sirviendo la
 * última grilla conocida en vez de devolver un error.
 *
 * El admin NO usa esto: allí un fallo tiene que verse, porque quien edita
 * necesita saber que su cambio no se guardó.
 */

type AsyncMethod = (...args: unknown[]) => Promise<unknown>;

/**
 * Cortacircuitos.
 *
 * Sin él, una página que hace ocho consultas espera ocho veces el timeout de
 * conexión: medido en local, 47 segundos para renderizar /programas con la
 * base caída. Tras el primer fallo se va directo a los datos locales durante
 * el enfriamiento, y la página responde al instante.
 *
 * El estado es del proceso, no global: cada instancia serverless descubre la
 * caída por su cuenta, lo cual es correcto — puede que solo una región falle.
 */
const COOLDOWN_MS = 30_000;

let circuitOpenedAt = 0;

function isCircuitOpen(): boolean {
  return circuitOpenedAt > 0 && Date.now() - circuitOpenedAt < COOLDOWN_MS;
}

/** Errores que significan "la base no está accesible", no "la consulta es mala". */
function isConnectionError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;

  const code = 'code' in error ? String((error as { code: unknown }).code) : '';
  if (
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    code === 'ENOTFOUND' ||
    code === 'EHOSTUNREACH' ||
    code === 'CONNECTION_CLOSED' ||
    code === 'CONNECTION_ENDED' ||
    code === 'CONNECT_TIMEOUT'
  ) {
    return true;
  }

  // Sin DATABASE_URL, requireSql lanza un Error normal.
  return (
    error instanceof Error && error.message.includes('DATABASE_URL')
  );
}

export function withFallback<T extends object>(
  primary: T,
  fallback: T,
  label: string,
): T {
  return new Proxy(primary, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value !== 'function') return value;

      const primaryMethod = value as AsyncMethod;

      return async (...args: unknown[]): Promise<unknown> => {
        const callFallback = (): Promise<unknown> => {
          const fallbackMethod = Reflect.get(fallback, prop) as AsyncMethod;
          return fallbackMethod.apply(fallback, args);
        };

        if (isCircuitOpen()) return callFallback();

        try {
          const result = await primaryMethod.apply(target, args);
          circuitOpenedAt = 0;
          return result;
        } catch (error) {
          if (isConnectionError(error)) {
            if (!isCircuitOpen()) {
              console.error(
                `[data] Banco de dados inacessível em ${label}.${String(prop)}. ` +
                  `Servindo dados locais pelos próximos ${COOLDOWN_MS / 1000}s.`,
                error,
              );
            }
            circuitOpenedAt = Date.now();
          } else {
            console.error(
              `[data] ${label}.${String(prop)} falhou; usando dados locais.`,
              error,
            );
          }
          return callFallback();
        }
      };
    },
  });
}
