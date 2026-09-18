import { requireAdmin } from '@/lib/auth/guard';
import { listUsers } from '@/lib/admin/queries';
import { UsersManager } from './UsersManager';

export default async function UsuariosPage() {
  const currentUser = await requireAdmin();
  const users = await listUsers();

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Usuários
        </h1>
        <p className="text-gray-600 dark:text-text-secondary mt-1">
          Quem pode entrar no painel e com qual permissão.
        </p>
      </header>

      <UsersManager users={users} currentUserId={currentUser.id} />
    </>
  );
}
