import type { ReactNode } from 'react';
import { requireUser } from '@/lib/auth/guard';
import { AdminShell } from '@/components/admin';
import { logoutAction } from './actions';

/**
 * Layout protegido. Todo lo que cuelga de aquí exige sesión.
 *
 * El guard del layout es la primera barrera, no la única: cada Server Action
 * vuelve a llamar a `requireUser()` porque las acciones son endpoints propios
 * y no pasan por este layout.
 */
export default async function PainelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  return (
    <AdminShell user={user} logoutAction={logoutAction}>
      {children}
    </AdminShell>
  );
}
