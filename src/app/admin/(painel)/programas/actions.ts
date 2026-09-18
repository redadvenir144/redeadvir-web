'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/guard';
import {
  createProgram,
  updateProgram,
  deleteProgram,
  countSlotsForProgram,
  type ProgramInput,
} from '@/lib/admin/queries';
import {
  readText,
  readInt,
  toSlug,
  validateSlug,
  describeDbError,
  type ActionState,
} from '@/lib/admin/form';

/** Refresca las rutas públicas que dependen de los programas. */
function revalidatePrograms(): void {
  revalidatePath('/');
  revalidatePath('/programas');
  revalidatePath('/programacao');
  revalidatePath('/admin/programas');
}

function parseProgram(formData: FormData): ProgramInput | string {
  const title = readText(formData, 'title');
  if (!title) return 'O nome do programa é obrigatório.';

  const slug = toSlug(readText(formData, 'slug') || title);
  const slugError = validateSlug(slug);
  if (slugError) return slugError;

  const categoryId = readText(formData, 'categoryId');
  if (!categoryId) return 'Escolha uma categoria.';

  const durationMinutes = readInt(formData, 'durationMinutes', 30);
  if (durationMinutes < 1 || durationMinutes > 720) {
    return 'A duração precisa estar entre 1 e 720 minutos.';
  }

  return {
    slug,
    title,
    description: readText(formData, 'description'),
    categoryId,
    thumbnailSrc: readText(formData, 'thumbnailSrc'),
    thumbnailAlt: readText(formData, 'thumbnailAlt'),
    durationMinutes,
  };
}

export async function createProgramAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const parsed = parseProgram(formData);
  if (typeof parsed === 'string') return { error: parsed };

  try {
    await createProgram(parsed);
  } catch (error) {
    return { error: describeDbError(error, 'createProgram') };
  }

  revalidatePrograms();
  return { success: `Programa "${parsed.title}" criado.` };
}

export async function updateProgramAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const id = readText(formData, 'id');
  if (!id) return { error: 'Programa não identificado.' };

  const parsed = parseProgram(formData);
  if (typeof parsed === 'string') return { error: parsed };

  try {
    await updateProgram(id, parsed);
  } catch (error) {
    return { error: describeDbError(error, 'updateProgram') };
  }

  revalidatePrograms();
  return { success: 'Alterações salvas.' };
}

export async function deleteProgramAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const id = readText(formData, 'id');
  if (!id) return { error: 'Programa não identificado.' };

  try {
    // Avisar antes es mejor que borrar media grilla en silencio.
    const slots = await countSlotsForProgram(id);
    await deleteProgram(id);

    revalidatePrograms();
    return {
      success:
        slots > 0
          ? `Programa excluído. ${slots} ${slots === 1 ? 'bloco foi removido' : 'blocos foram removidos'} da grade.`
          : 'Programa excluído.',
    };
  } catch (error) {
    return { error: describeDbError(error, 'deleteProgram') };
  }
}
