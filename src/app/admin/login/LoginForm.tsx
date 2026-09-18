'use client';

import { useFormState } from 'react-dom';
import { loginAction, type LoginState } from './actions';
import {
  Field,
  TextInput,
  SubmitButton,
  FormMessage,
} from '@/components/admin';

const INITIAL: LoginState = {};

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, INITIAL);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage message={state.error} tone="error" />

      <Field label="E-mail" name="email">
        <TextInput
          name="email"
          type="email"
          required
          autoComplete="username"
          placeholder="seu@email.com"
        />
      </Field>

      <Field label="Senha" name="password">
        <TextInput
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </Field>

      <div className="mt-2">
        <SubmitButton>Entrar</SubmitButton>
      </div>
    </form>
  );
}
