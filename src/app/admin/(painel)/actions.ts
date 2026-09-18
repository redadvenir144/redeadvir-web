'use server';

import { redirect } from 'next/navigation';
import { destroySession } from '@/lib/auth/session';

/**
 * Cierra la sesión y vuelve al login.
 */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect('/admin/login');
}
