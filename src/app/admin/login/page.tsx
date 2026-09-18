import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  // Quien ya tiene sesión no necesita ver el formulario.
  const user = await getCurrentUser();
  if (user) redirect('/admin');

  return (
    <main className="min-h-screen bg-paper dark:bg-tv-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            REDE ADVIR
          </h1>
          <p className="text-sm text-gray-600 dark:text-text-secondary mt-1">
            Painel administrativo
          </p>
        </header>

        <div className="bg-paper-raised dark:bg-tv-card border border-paper-border dark:border-tv-border rounded-xl p-6">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-text-muted mt-6">
          Acesso restrito à equipe da REDE ADVIR.
        </p>
      </div>
    </main>
  );
}
