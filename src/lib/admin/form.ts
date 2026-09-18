import 'server-only';

/**
 * Lectura y validación de FormData.
 *
 * Los datos de un formulario son texto sin garantías: aquí se convierten a
 * tipos y se validan. `ActionState` es lo que toda Server Action devuelve, con
 * un mensaje ya redactado en pt-BR — nunca el error técnico.
 */

export interface ActionState {
  error?: string;
  success?: string;
}

export function readText(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim();
}

export function readBoolean(formData: FormData, key: string): boolean {
  return formData.get(key) !== null;
}

export function readInt(
  formData: FormData,
  key: string,
  fallback: number,
): number {
  const raw = readText(formData, key);
  if (raw === '') return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Convierte un texto en slug: minúsculas, sin acentos, con guiones.
 * Si el usuario deja el campo vacío, se genera a partir del título.
 */
export function toSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Valida un slug ya normalizado. Devuelve el error en pt-BR o null. */
export function validateSlug(slug: string): string | null {
  if (!slug) return 'O endereço (slug) não pode ficar vazio.';
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return 'O endereço (slug) só aceita letras minúsculas, números e hífen.';
  }
  return null;
}

/**
 * Traduce un fallo de base de datos en un mensaje que el usuario entienda.
 * El detalle técnico va a consola, nunca a pantalla.
 */
export function describeDbError(error: unknown, context: string): string {
  console.error(`[admin] ${context}:`, error);

  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : '';

  switch (code) {
    case '23505': // unique_violation
      return 'Já existe um registro com esse endereço (slug). Escolha outro.';
    case '23503': // foreign_key_violation
      return 'Esse item está sendo usado em outro lugar e não pode ser removido.';
    case '23514': // check_violation
      return 'Algum valor está fora do permitido. Revise os campos.';
    default:
      return 'Não foi possível salvar agora. Tente novamente em instantes.';
  }
}
