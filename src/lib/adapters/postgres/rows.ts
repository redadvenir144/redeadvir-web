import 'server-only';
import type { Program, Video, Page, Article } from '@/types/content';

/**
 * Filas tal y como las devuelve Postgres, y su conversión a los tipos del
 * dominio. Vive aparte para que los adaptadores no repitan el mapeo.
 */

export interface ProgramRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  category_id: string;
  category_slug: string;
  category_name: string;
  thumbnail_src: string;
  thumbnail_alt: string;
  thumbnail_width: number;
  thumbnail_height: number;
  duration_minutes: number;
}

export function toProgram(row: ProgramRow): Program {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: {
      id: row.category_id,
      slug: row.category_slug,
      name: row.category_name,
    },
    thumbnail: {
      src: row.thumbnail_src,
      alt: row.thumbnail_alt,
      width: row.thumbnail_width,
      height: row.thumbnail_height,
    },
    durationMinutes: row.duration_minutes,
  };
}

export interface VideoRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  category_id: string | null;
  category_slug: string | null;
  category_name: string | null;
  url: string;
  thumbnail_src: string;
  thumbnail_alt: string;
  duration_seconds: number;
  published_at: Date;
}

export function toVideo(row: VideoRow): Video {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category:
      row.category_id && row.category_slug && row.category_name
        ? {
            id: row.category_id,
            slug: row.category_slug,
            name: row.category_name,
          }
        : null,
    url: row.url,
    thumbnail: row.thumbnail_src
      ? {
          src: row.thumbnail_src,
          alt: row.thumbnail_alt,
          width: 1280,
          height: 720,
        }
      : null,
    durationSeconds: row.duration_seconds,
    publishedAt: row.published_at.toISOString(),
  };
}

export interface PageRow {
  slug: string;
  title: string;
  description: string;
  body: string;
  updated_at: Date;
}

export function toPage(row: PageRow): Page {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    body: row.body,
    updatedAt: row.updated_at.toISOString(),
  };
}

export interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  category_id: string | null;
  category_slug: string | null;
  category_name: string | null;
  thumbnail_src: string;
  thumbnail_alt: string;
  published_at: Date;
  updated_at: Date;
}

export function toArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    author: row.author,
    category:
      row.category_id && row.category_slug && row.category_name
        ? {
            id: row.category_id,
            slug: row.category_slug,
            name: row.category_name,
          }
        : null,
    thumbnail: row.thumbnail_src
      ? {
          src: row.thumbnail_src,
          alt: row.thumbnail_alt,
          width: 1200,
          height: 630,
        }
      : null,
    publishedAt: row.published_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}
