/**
 * Tipos de contenido para Rede ADVIR
 * Fechas siempre como string ISO 8601 con offset (ej: "2024-01-15T14:30:00-03:00")
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: Category;
  thumbnail: ImageAsset;
  /** Duración en minutos */
  durationMinutes: number;
}

export interface ScheduleSlot {
  id: string;
  program: Program;
  /** ISO 8601 con offset */
  startTime: string;
  /** ISO 8601 con offset */
  endTime: string;
  status: 'past' | 'live' | 'upcoming';
}

/**
 * Notícia publicada en /noticias.
 * `category` y `thumbnail` son opcionales: no toda nota lleva imagen.
 */
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Cuerpo en texto plano; los párrafos se separan por línea en blanco. */
  body: string;
  author: string;
  category: Category | null;
  thumbnail: ImageAsset | null;
  /** ISO 8601 con offset */
  publishedAt: string;
  /** ISO 8601 con offset */
  updatedAt: string;
}

/**
 * Vídeo del catálogo (/videos).
 */
export interface Video {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: Category | null;
  /** URL de reproducción (YouTube, MP4, HLS…). Vacía si aún no hay. */
  url: string;
  thumbnail: ImageAsset | null;
  /** Duración en segundos. 0 si se desconoce. */
  durationSeconds: number;
  /** ISO 8601 con offset */
  publishedAt: string;
}

/**
 * Página de texto editable (Sobre, Doar, políticas).
 */
export interface Page {
  slug: string;
  title: string;
  /** Meta description para SEO. Nunca duplicada entre páginas. */
  description: string;
  /** Cuerpo en texto plano con saltos de línea. */
  body: string;
  /** ISO 8601 con offset */
  updatedAt: string;
}

/**
 * Día de la semana. 0 = domingo … 6 = sábado (igual que Date#getDay).
 */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Bloque de la grilla tal y como se edita en el admin: por día de la semana,
 * sin fecha absoluta. El repositorio lo convierte en ScheduleSlot.
 */
export interface ScheduleEntry {
  id: string;
  programId: string;
  dayOfWeek: DayOfWeek;
  startHour: number;
  startMinute: number;
  durationMinutes: number;
}
