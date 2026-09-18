'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/guard';
import {
  createArticle,
  updateArticle,
  deleteArticle,
  type ArticleInput,
} from '@/lib/admin/queries';
import {
  readText,
  readBoolean,
  toSlug,
  validateSlug,
  describeDbError,
  type ActionState,
} from '@/lib/admin/form';

function revalidateNews(slug?: string): void {
  revalidatePath('/noticias');
  if (slug) revalidatePath(`/noticias/${slug}`);
  revalidatePath('/admin/noticias');
}

function parseArticle(formData: FormData): ArticleInput | string {
  const title = readText(formData, 'title');
  if (!title) return 'O título da notícia é obrigatório.';

  const slug = toSlug(readText(formData, 'slug') || title);
  const slugError = validateSlug(slug);
  if (slugError) return slugError;

  const excerpt = readText(formData, 'excerpt');
  if (!excerpt) {
    // El resumen es lo que se ve en la lista y en el buscador.
    return 'O resumo é obrigatório — é o que aparece na listagem e no Google.';
  }

  const publishedRaw = readText(formData, 'publishedAt');
  // <input type="date"> no trae hora: se ancla al mediodía en el huso del
  // canal para que no salte de día al convertir a UTC.
  const publishedAt = publishedRaw
    ? new Date(`${publishedRaw}T12:00:00-03:00`)
    : new Date();

  if (Number.isNaN(publishedAt.getTime())) {
    return 'Data de publicação inválida.';
  }

  const categoryId = readText(formData, 'categoryId');

  return {
    slug,
    title,
    excerpt,
    body: String(formData.get('body') ?? ''),
    author: readText(formData, 'author'),
    categoryId: categoryId || null,
    thumbnailSrc: readText(formData, 'thumbnailSrc'),
    thumbnailAlt: readText(formData, 'thumbnailAlt'),
    publishedAt,
    isPublished: readBoolean(formData, 'isPublished'),
  };
}

export async function createArticleAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const parsed = parseArticle(formData);
  if (typeof parsed === 'string') return { error: parsed };

  try {
    await createArticle(parsed);
  } catch (error) {
    return { error: describeDbError(error, 'createArticle') };
  }

  revalidateNews(parsed.slug);
  return {
    success: parsed.isPublished
      ? `"${parsed.title}" publicada.`
      : `"${parsed.title}" salva como rascunho.`,
  };
}

export async function updateArticleAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const id = readText(formData, 'id');
  if (!id) return { error: 'Notícia não identificada.' };

  const parsed = parseArticle(formData);
  if (typeof parsed === 'string') return { error: parsed };

  try {
    await updateArticle(id, parsed);
  } catch (error) {
    return { error: describeDbError(error, 'updateArticle') };
  }

  revalidateNews(parsed.slug);
  return { success: 'Alterações salvas.' };
}

export async function deleteArticleAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const id = readText(formData, 'id');
  if (!id) return { error: 'Notícia não identificada.' };

  try {
    await deleteArticle(id);
  } catch (error) {
    return { error: describeDbError(error, 'deleteArticle') };
  }

  revalidateNews();
  return { success: 'Notícia excluída.' };
}
