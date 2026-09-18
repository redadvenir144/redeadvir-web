'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/guard';
import {
  createSlot,
  updateSlot,
  deleteSlot,
  copyDaySchedule,
  type SlotInput,
} from '@/lib/admin/queries';
import {
  readText,
  readInt,
  describeDbError,
  type ActionState,
} from '@/lib/admin/form';
import type { DayOfWeek } from '@/types/content';

function revalidateSchedule(): void {
  revalidatePath('/');
  revalidatePath('/programacao');
  revalidatePath('/programas', 'layout');
  revalidatePath('/admin/grade');
}

function isDayOfWeek(value: number): value is DayOfWeek {
  return Number.isInteger(value) && value >= 0 && value <= 6;
}

function parseSlot(formData: FormData): SlotInput | string {
  const programId = readText(formData, 'programId');
  if (!programId) return 'Escolha um programa.';

  const dayOfWeek = readInt(formData, 'dayOfWeek', -1);
  if (!isDayOfWeek(dayOfWeek)) return 'Dia da semana inválido.';

  const startHour = readInt(formData, 'startHour', -1);
  if (startHour < 0 || startHour > 23) {
    return 'A hora precisa estar entre 0 e 23.';
  }

  const startMinute = readInt(formData, 'startMinute', 0);
  if (startMinute < 0 || startMinute > 59) {
    return 'Os minutos precisam estar entre 0 e 59.';
  }

  const durationMinutes = readInt(formData, 'durationMinutes', 30);
  if (durationMinutes < 1 || durationMinutes > 720) {
    return 'A duração precisa estar entre 1 e 720 minutos.';
  }

  return { programId, dayOfWeek, startHour, startMinute, durationMinutes };
}

export async function createSlotAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const parsed = parseSlot(formData);
  if (typeof parsed === 'string') return { error: parsed };

  try {
    await createSlot(parsed);
  } catch (error) {
    // El índice único de (día, hora, minuto) impide dos programas a la vez.
    return { error: describeDbError(error, 'createSlot') };
  }

  revalidateSchedule();
  const time = `${String(parsed.startHour).padStart(2, '0')}:${String(parsed.startMinute).padStart(2, '0')}`;
  return { success: `Bloco das ${time} adicionado.` };
}

export async function updateSlotAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const id = readText(formData, 'id');
  if (!id) return { error: 'Bloco não identificado.' };

  const parsed = parseSlot(formData);
  if (typeof parsed === 'string') return { error: parsed };

  try {
    await updateSlot(id, parsed);
  } catch (error) {
    return { error: describeDbError(error, 'updateSlot') };
  }

  revalidateSchedule();
  return { success: 'Bloco atualizado.' };
}

export async function deleteSlotAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const id = readText(formData, 'id');
  if (!id) return { error: 'Bloco não identificado.' };

  try {
    await deleteSlot(id);
  } catch (error) {
    return { error: describeDbError(error, 'deleteSlot') };
  }

  revalidateSchedule();
  return { success: 'Bloco removido.' };
}

/**
 * Copia la grilla de un día a los días marcados, reemplazando la que tuvieran.
 * Es destructivo, así que la confirmación se pide en el cliente.
 */
export async function copyDayAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const fromDay = readInt(formData, 'fromDay', -1);
  if (!isDayOfWeek(fromDay)) return { error: 'Dia de origem inválido.' };

  const toDays = formData
    .getAll('toDays')
    .map((value) => Number.parseInt(String(value), 10))
    .filter(isDayOfWeek);

  if (toDays.length === 0) {
    return { error: 'Marque pelo menos um dia de destino.' };
  }

  try {
    const copied = await copyDaySchedule(fromDay, toDays);
    revalidateSchedule();

    if (copied === 0) {
      return {
        error:
          'Nada foi copiado: o dia de origem está vazio ou você marcou só ele mesmo.',
      };
    }
    return { success: `${copied} blocos copiados.` };
  } catch (error) {
    return { error: describeDbError(error, 'copyDaySchedule') };
  }
}
