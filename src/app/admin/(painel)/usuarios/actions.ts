'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/guard';
import {
  createUser,
  deleteUser,
  updateUserPassword,
  countAdmins,
  listUsers,
} from '@/lib/admin/queries';
import { hashPassword, validatePassword } from '@/lib/auth/password';
import type { AdminRole } from '@/lib/auth/session';
import {
  readText,
  describeDbError,
  type ActionState,
} from '@/lib/admin/form';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseRole(value: string): AdminRole {
  return value === 'admin' ? 'admin' : 'editor';
}

export async function createUserAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const email = readText(formData, 'email').toLowerCase();
  const name = readText(formData, 'name');
  const password = String(formData.get('password') ?? '');
  const role = parseRole(readText(formData, 'role'));

  if (!isValidEmail(email)) return { error: 'Informe um e-mail válido.' };
  if (!name) return { error: 'O nome é obrigatório.' };

  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError };

  try {
    await createUser(email, name, await hashPassword(password), role);
  } catch (error) {
    // El índice único de email produce el 23505 que describeDbError traduce,
    // pero aquí el mensaje genérico de slug no encaja.
    const described = describeDbError(error, 'createUser');
    return {
      error: described.includes('slug')
        ? 'Já existe um usuário com esse e-mail.'
        : described,
    };
  }

  revalidatePath('/admin/usuarios');
  return { success: `Usuário ${name} criado.` };
}

export async function resetPasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = readText(formData, 'id');
  if (!id) return { error: 'Usuário não identificado.' };

  const password = String(formData.get('password') ?? '');
  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError };

  try {
    await updateUserPassword(id, await hashPassword(password));
  } catch (error) {
    return { error: describeDbError(error, 'updateUserPassword') };
  }

  revalidatePath('/admin/usuarios');
  return {
    success: 'Senha alterada. As sessões abertas desse usuário foram encerradas.',
  };
}

export async function deleteUserAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const currentUser = await requireAdmin();

  const id = readText(formData, 'id');
  if (!id) return { error: 'Usuário não identificado.' };

  if (id === currentUser.id) {
    return { error: 'Você não pode excluir a própria conta.' };
  }

  try {
    // Quedarse sin ningún admin deja el panel sin quien gestione usuarios.
    const users = await listUsers();
    const target = users.find((user) => user.id === id);
    if (!target) return { error: 'Usuário não encontrado.' };

    if (target.role === 'admin' && (await countAdmins()) <= 1) {
      return {
        error: 'É preciso manter pelo menos um administrador.',
      };
    }

    await deleteUser(id);
  } catch (error) {
    return { error: describeDbError(error, 'deleteUser') };
  }

  revalidatePath('/admin/usuarios');
  return { success: 'Usuário excluído.' };
}
