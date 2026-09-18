import 'server-only';
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

/**
 * Hash de contraseña con scrypt, del `node:crypto` nativo.
 *
 * No usamos bcrypt/argon2 para no añadir una dependencia nativa: scrypt está
 * en el runtime de Node, es resistente a hardware dedicado y es la opción que
 * la propia documentación de Node recomienda para contraseñas.
 *
 * Formato guardado: "<salt hex>:<hash hex>".
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derived.toString('hex')}`;
}

/**
 * Compara una contraseña contra un hash guardado.
 * Siempre en tiempo constante, para no filtrar información por el tiempo
 * de respuesta. Nunca lanza: un hash corrupto devuelve `false`.
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  try {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return false;

    const hashBuffer = Buffer.from(hash, 'hex');
    if (hashBuffer.length !== KEY_LENGTH) return false;

    const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
    return timingSafeEqual(hashBuffer, derived);
  } catch {
    return false;
  }
}

/**
 * Reglas mínimas de contraseña. Devuelve el error en pt-BR o null si es válida.
 */
export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'A senha precisa ter pelo menos 8 caracteres.';
  }
  if (password.length > 200) {
    return 'A senha é longa demais.';
  }
  return null;
}
