'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/guard';
import { upsertPage, deletePage } from '@/lib/admin/queries';
import {
  readText,
  readBoolean,
  toSlug,
  validateSlug,
  describeDbError,
  type ActionState,
} from '@/lib/admin/form';

export async function savePageAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const title = readText(formData, 'title');
  if (!title) return { error: 'O título da página é obrigatório.' };

  const slug = toSlug(readText(formData, 'slug') || title);
  const slugError = validateSlug(slug);
  if (slugError) return { error: slugError };

  const description = readText(formData, 'description');
  if (!description) {
    // La regla de SEO del proyecto prohíbe descriptions duplicadas o ausentes.
    return { error: 'A descrição é obrigatória — ela aparece no Google.' };
  }

  try {
    await upsertPage({
      slug,
      title,
      description,
      body: String(formData.get('body') ?? ''),
      isPublished: readBoolean(formData, 'isPublished'),
    });
  } catch (error) {
    return { error: describeDbError(error, 'upsertPage') };
  }

  revalidatePath(`/${slug}`);
  revalidatePath('/admin/paginas');
  return { success: `Página "${title}" salva.` };
}

export async function deletePageAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const slug = readText(formData, 'slug');
  if (!slug) return { error: 'Página não identificada.' };

  try {
    await deletePage(slug);
  } catch (error) {
    return { error: describeDbError(error, 'deletePage') };
  }

  revalidatePath(`/${slug}`);
  revalidatePath('/admin/paginas');
  return { success: 'Página excluída.' };
}
