'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/guard';
import {
  createVideo,
  updateVideo,
  deleteVideo,
  type VideoInput,
} from '@/lib/admin/queries';
import {
  readText,
  readInt,
  readBoolean,
  toSlug,
  validateSlug,
  describeDbError,
  type ActionState,
} from '@/lib/admin/form';

function revalidateVideos(): void {
  revalidatePath('/videos');
  revalidatePath('/admin/videos');
}

function parseVideo(formData: FormData): VideoInput | string {
  const title = readText(formData, 'title');
  if (!title) return 'O título do vídeo é obrigatório.';

  const slug = toSlug(readText(formData, 'slug') || title);
  const slugError = validateSlug(slug);
  if (slugError) return slugError;

  const minutes = readInt(formData, 'durationMinutes', 0);
  const seconds = readInt(formData, 'durationSeconds', 0);
  if (minutes < 0 || seconds < 0 || seconds > 59) {
    return 'Duração inválida. Os segundos vão de 0 a 59.';
  }

  const publishedRaw = readText(formData, 'publishedAt');
  // <input type="date"> da "YYYY-MM-DD" sin hora: se ancla al mediodía en el
  // huso del canal para que no salte de día al convertir a UTC.
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
    description: readText(formData, 'description'),
    categoryId: categoryId || null,
    url: readText(formData, 'url'),
    thumbnailSrc: readText(formData, 'thumbnailSrc'),
    thumbnailAlt: readText(formData, 'thumbnailAlt'),
    durationSeconds: minutes * 60 + seconds,
    publishedAt,
    isPublished: readBoolean(formData, 'isPublished'),
  };
}

export async function createVideoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const parsed = parseVideo(formData);
  if (typeof parsed === 'string') return { error: parsed };

  try {
    await createVideo(parsed);
  } catch (error) {
    return { error: describeDbError(error, 'createVideo') };
  }

  revalidateVideos();
  return {
    success: parsed.isPublished
      ? `"${parsed.title}" publicado.`
      : `"${parsed.title}" salvo como rascunho.`,
  };
}

export async function updateVideoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const id = readText(formData, 'id');
  if (!id) return { error: 'Vídeo não identificado.' };

  const parsed = parseVideo(formData);
  if (typeof parsed === 'string') return { error: parsed };

  try {
    await updateVideo(id, parsed);
  } catch (error) {
    return { error: describeDbError(error, 'updateVideo') };
  }

  revalidateVideos();
  return { success: 'Alterações salvas.' };
}

export async function deleteVideoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const id = readText(formData, 'id');
  if (!id) return { error: 'Vídeo não identificado.' };

  try {
    await deleteVideo(id);
  } catch (error) {
    return { error: describeDbError(error, 'deleteVideo') };
  }

  revalidateVideos();
  return { success: 'Vídeo excluído.' };
}
