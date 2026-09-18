'use server';

import { redirect } from 'next/navigation';
import { isDatabaseConfigured } from '@/lib/db/client';
import { findUserByEmail } from '@/lib/admin/queries';
import { verifyPassword } from '@/lib/auth/password';
import { createSession, pruneExpiredSessions } from '@/lib/auth/session';

export interface LoginState {
  error?: string;
}

/**
 * Autentica al usuario y abre la sesión.
 *
 * El mensaje de error es el mismo tanto si el email no existe como si la
 * contraseña falla: distinguirlos le diría a quien lo intente qué correos
 * están dados de alta.
 */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isDatabaseConfigured) {
    return {
      error:
        'O painel ainda não está configurado. Fale com o responsável técnico.',
    };
  }

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Preencha o e-mail e a senha.' };
  }

  try {
    const user = await findUserByEmail(email);

    // Se verifica la contraseña incluso sin usuario, contra un hash de
    // descarte, para que el tiempo de respuesta no revele si el email existe.
    const storedHash =
      user?.password_hash ??
      '00000000000000000000000000000000:' + '0'.repeat(128);

    const valid = await verifyPassword(password, storedHash);

    if (!user || !valid) {
      return { error: 'E-mail ou senha incorretos.' };
    }

    await pruneExpiredSessions();
    await createSession(user.id);
  } catch (error) {
    console.error('[admin] Falha no login:', error);
    return {
      error: 'Não foi possível entrar agora. Tente novamente em instantes.',
    };
  }

  redirect('/admin');
}
