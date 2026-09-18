'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import {
  Panel,
  EmptyRow,
  Field,
  TextInput,
  TextArea,
  Checkbox,
  SubmitButton,
  DeleteButton,
  FormMessage,
} from '@/components/admin';
import type { ActionState } from '@/lib/admin/form';
import type { AdminPage } from '@/lib/admin/queries';
import { savePageAction, deletePageAction } from './actions';

const INITIAL: ActionState = {};

function PageFields({ page }: { page?: AdminPage }) {
  const prefix = page ? `edit-${page.slug}-` : 'new-';

  return (
    <div className="flex flex-col gap-4">
      <Field label="Título" name={`${prefix}title`}>
        <TextInput name="title" defaultValue={page?.title} required />
      </Field>

      <Field
        label="Endereço (slug)"
        name={`${prefix}slug`}
        hint={
          page
            ? 'Mudar o endereço cria uma página nova; a antiga continua existindo.'
            : 'A página fica em /endereco. Deixe vazio para gerar a partir do título.'
        }
      >
        <TextInput
          name="slug"
          defaultValue={page?.slug}
          placeholder="privacidade"
        />
      </Field>

      <Field
        label="Descrição"
        name={`${prefix}description`}
        hint="Aparece no Google. Precisa ser diferente da de todas as outras páginas."
      >
        <TextArea
          name="description"
          rows={2}
          defaultValue={page?.description}
          required
        />
      </Field>

      <Field
        label="Conteúdo"
        name={`${prefix}body`}
        hint="Texto corrido. Deixe uma linha em branco para separar parágrafos."
      >
        <TextArea name="body" rows={14} defaultValue={page?.body} />
      </Field>

      <Checkbox
        name="isPublished"
        label="Publicada (visível no site)"
        defaultChecked={page ? page.is_published : true}
      />
    </div>
  );
}

function CreatePageForm() {
  const [state, formAction] = useFormState(savePageAction, INITIAL);
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <>
        <FormMessage message={state.success} tone="success" />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mt-3 inline-flex items-center min-h-11 px-5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          Nova página
        </button>
      </>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage message={state.error} tone="error" />
      <FormMessage message={state.success} tone="success" />
      <PageFields />
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>Criar página</SubmitButton>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="min-h-11 px-4 text-sm font-medium text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function PageRow({ page }: { page: AdminPage }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editState, editAction] = useFormState(savePageAction, INITIAL);
  const [deleteState, deleteAction] = useFormState(deletePageAction, INITIAL);

  return (
    <li className="py-4 border-b border-paper-border dark:border-tv-border last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {page.title}
            </h3>
            {!page.is_published && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                Rascunho
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-text-secondary mt-0.5">
            /{page.slug} · atualizada em{' '}
            {new Date(page.updated_at).toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsEditing((open) => !open)}
            aria-expanded={isEditing}
            className="min-h-11 px-4 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
          >
            {isEditing ? 'Fechar' : 'Editar'}
          </button>

          <form action={deleteAction}>
            <input type="hidden" name="slug" value={page.slug} />
            <DeleteButton confirmMessage={`Excluir a página "${page.title}"?`} />
          </form>
        </div>
      </div>

      <FormMessage message={deleteState.error} tone="error" />

      {isEditing && (
        <form action={editAction} className="mt-4 flex flex-col gap-4">
          <FormMessage message={editState.error} tone="error" />
          <FormMessage message={editState.success} tone="success" />
          <PageFields page={page} />
          <div>
            <SubmitButton>Salvar alterações</SubmitButton>
          </div>
        </form>
      )}
    </li>
  );
}

export function PagesManager({ pages }: { pages: AdminPage[] }) {
  return (
    <>
      <Panel
        title="Nova página"
        description="Útil para Política de Privacidade, Termos de Uso e textos institucionais."
      >
        <CreatePageForm />
      </Panel>

      <Panel title={`Páginas (${pages.length})`}>
        {pages.length === 0 ? (
          <EmptyRow>Nenhuma página cadastrada ainda.</EmptyRow>
        ) : (
          <ul>
            {pages.map((page) => (
              <PageRow key={page.slug} page={page} />
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
