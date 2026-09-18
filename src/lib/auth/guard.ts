import 'server-only';
import { redirect } from 'next/navigation';
import { getCurrentUser, type AdminUser } from './session';

/**
 * Exige sesión válida. Redirige a /admin/login si no la hay.
 *
 * Se llama en el layout del admin y, además, al principio de CADA Server
 * Action. Proteger solo el layout no basta: las Server Actions son endpoints
 * HTTP que se pueden invocar directamente sin pasar por la página.
 */
export async function requireUser(): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }
  return user;
}

/**
 * Exige rol de administrador. Los editores no gestionan usuarios.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await requireUser();
  if (user.role !== 'admin') {
    redirect('/admin?erro=sem-permissao');
  }
  return user;
}
