import type { Article } from '@/types/content';

/**
 * MOCK: sin notícias.
 *
 * Es deliberado: la lista arranca vacía y la página muestra su estado vacío
 * en vez de inventar noticias falsas. El contenido real se publica desde
 * /admin/noticias.
 */
export const news: Article[] = [];
