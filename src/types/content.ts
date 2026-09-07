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

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: Category;
  thumbnail: ImageAsset;
  /** ISO 8601 con offset */
  publishedAt: string;
  /** ISO 8601 con offset */
  updatedAt: string;
}
