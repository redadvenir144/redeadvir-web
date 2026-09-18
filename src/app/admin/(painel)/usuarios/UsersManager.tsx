'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import {
  Panel,
  Field,
  TextInput,
  Select,
  SubmitButton,
  DeleteButton,
  FormMessage,
} from '@/components/admin';
import type { ActionState } from '@/lib/admin/form';
import type { AdminUserRow } from '@/lib/admin/queries';
import {
  createUserAction,
  resetPasswordAction,
  deleteUserAction,
} from './actions';

const INITIAL: ActionState = {};

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  editor: 'Editor',
};

function CreateUserForm() {
  const [state, formAction] = useFormState(createUserAction, INITIAL);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage message={state.error} tone="error" />
      <FormMessage message={state.success} tone="success" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nome" name="name">
          <TextInput name="name" required placeholder="Maria Silva" />
        </Field>

        <Field label="E-mail" name="email">
          <TextInput
            name="email"
            type="email"
            required
            autoComplete="off"
            placeholder="maria@redeadvir.com.br"
          />
        </Field>

        <Field
          label="Senha"
          name="password"
          hint="Mínimo 8 caracteres. Passe a senha à pessoa por um canal seguro."
        >
          <TextInput
            name="password"
            type="password"
            required
            autoComplete="new-password"
          />
        </Field>

        <Field
          label="Permissão"
          name="role"
          hint="Editores mexem no conteúdo. Administradores também gerenciam usuários."
        >
          <Select
            name="role"
            defaultValue="editor"
            options={[
              { value: 'editor', label: 'Editor' },
              { value: 'admin', label: 'Administrador' },
            ]}
          />
        </Field>
      </div>

      <div>
        <SubmitButton>Criar usuário</SubmitButton>
      </div>
    </form>
  );
}

function UserRow({
  user,
  currentUserId,
  deleteAction,
}: {
  user: AdminUserRow;
  currentUserId: string;
  /** Acción de borrado del padre: su resultado sobrevive a esta fila. */
  deleteAction: (formData: FormData) => void;
}) {
  const [isResetting, setIsResetting] = useState(false);
  const [resetState, resetAction] = useFormState(resetPasswordAction, INITIAL);

  const isSelf = user.id === currentUserId;

  return (
    <li className="py-4 border-b border-paper-border dark:border-tv-border last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {user.name}
            </h3>
            {isSelf && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-800 dark:text-brand-300">
                Você
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-text-secondary mt-0.5">
            {user.email} · {ROLE_LABELS[user.role] ?? user.role}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsResetting((open) => !open)}
            aria-expanded={isResetting}
            className="min-h-11 px-4 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
          >
            {isResetting ? 'Fechar' : 'Trocar senha'}
          </button>

          {!isSelf && (
            <form action={deleteAction}>
              <input type="hidden" name="id" value={user.id} />
              <DeleteButton
                confirmMessage={`Excluir o acesso de ${user.name}?`}
              />
            </form>
          )}
        </div>
      </div>

      {isResetting && (
        <form action={resetAction} className="mt-4 flex flex-col gap-4">
          <input type="hidden" name="id" value={user.id} />
          <FormMessage message={resetState.error} tone="error" />
          <FormMessage message={resetState.success} tone="success" />

          <div className="max-w-sm">
            <Field
              label="Nova senha"
              name={`password-${user.id}`}
              hint="Mínimo 8 caracteres. As sessões abertas dessa pessoa serão encerradas."
            >
              <TextInput
                name="password"
                type="password"
                required
                autoComplete="new-password"
              />
            </Field>
          </div>

          <div>
            <SubmitButton>Trocar senha</SubmitButton>
          </div>
        </form>
      )}
    </li>
  );
}

export function UsersManager({
  users,
  currentUserId,
}: {
  users: AdminUserRow[];
  currentUserId: string;
}) {
  const [deleteState, deleteAction] = useFormState(deleteUserAction, INITIAL);

  return (
    <>
      <Panel title="Novo usuário">
        <CreateUserForm />
      </Panel>

      <Panel title={`Usuários (${users.length})`}>
        <div className="mb-3 flex flex-col gap-2 empty:mb-0">
          <FormMessage message={deleteState.error} tone="error" />
          <FormMessage message={deleteState.success} tone="success" />
        </div>

        <ul>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              currentUserId={currentUserId}
              deleteAction={deleteAction}
            />
          ))}
        </ul>
      </Panel>
    </>
  );
}
