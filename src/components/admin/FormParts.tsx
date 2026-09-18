'use client';

import { useFormStatus } from 'react-dom';
import type { ReactNode } from 'react';

/**
 * Botón de envío que se bloquea y avisa mientras la acción está en curso.
 * Sin esto, en una conexión lenta el usuario pulsa varias veces y duplica
 * el registro.
 */
export function SubmitButton({
  children,
  variant = 'primary',
}: {
  children: ReactNode;
  variant?: 'primary' | 'danger';
}) {
  const { pending } = useFormStatus();

  const palette =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
      : 'bg-brand-600 hover:bg-brand-700 active:bg-brand-800';

  return (
    <button
      type="submit"
      disabled={pending}
      className={[
        'inline-flex items-center justify-center gap-2',
        'min-h-11 px-5 py-2.5',
        palette,
        'text-white font-semibold rounded-lg',
        'transition-colors',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
      ].join(' ')}
    >
      {pending ? 'Salvando…' : children}
    </button>
  );
}

/**
 * Botón de borrado con confirmación del navegador.
 * Borrar es irreversible y el público del canal no es técnico: un paso extra
 * vale más que un "deshacer" que no existe.
 */
export function DeleteButton({
  label = 'Excluir',
  confirmMessage,
}: {
  label?: string;
  confirmMessage: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      className={[
        'inline-flex items-center justify-center',
        'min-h-11 px-4 py-2',
        'text-sm font-medium',
        'text-red-700 dark:text-red-400',
        'hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg',
        'transition-colors',
        'disabled:opacity-60',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
      ].join(' ')}
    >
      {pending ? 'Excluindo…' : label}
    </button>
  );
}

/**
 * Mensaje de resultado de una acción.
 * Nunca muestra el error técnico: el detalle va a consola, aquí va una frase
 * que el usuario pueda entender y accionar.
 */
export function FormMessage({
  message,
  tone,
}: {
  message?: string;
  tone: 'success' | 'error';
}) {
  if (!message) return null;

  const palette =
    tone === 'success'
      ? 'bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900'
      : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-900';

  return (
    <p
      role="status"
      className={`rounded-lg border px-4 py-3 text-sm ${palette}`}
    >
      {message}
    </p>
  );
}
