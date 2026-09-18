'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import {
  Panel,
  EmptyRow,
  Field,
  TextInput,
  TextArea,
  Select,
  SubmitButton,
  DeleteButton,
  FormMessage,
} from '@/components/admin';
import type { ActionState } from '@/lib/admin/form';
import type { AdminProgram, AdminCategory } from '@/lib/admin/queries';
import {
  createProgramAction,
  updateProgramAction,
  deleteProgramAction,
} from './actions';

const INITIAL: ActionState = {};

interface Props {
  programs: AdminProgram[];
  categories: AdminCategory[];
}

/**
 * Campos compartidos por el alta y la edición.
 */
function ProgramFields({
  program,
  categories,
}: {
  program?: AdminProgram;
  categories: AdminCategory[];
}) {
  const prefix = program ? `edit-${program.id}-` : 'new-';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <Field label="Nome do programa" name={`${prefix}title`}>
          <TextInput
            name="title"
            defaultValue={program?.title}
            required
            placeholder="Fonte de Água Viva"
          />
        </Field>
      </div>

      <Field
        label="Endereço (slug)"
        name={`${prefix}slug`}
        hint="Deixe vazio para gerar a partir do nome."
      >
        <TextInput
          name="slug"
          defaultValue={program?.slug}
          placeholder="fonte-de-agua-viva"
        />
      </Field>

      <Field label="Categoria" name={`${prefix}categoryId`}>
        <Select
          name="categoryId"
          defaultValue={program?.category_id}
          required
          placeholder="Escolha…"
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
        />
      </Field>

      <Field label="Duração (minutos)" name={`${prefix}durationMinutes`}>
        <TextInput
          name="durationMinutes"
          type="number"
          min={1}
          max={720}
          defaultValue={program?.duration_minutes ?? 30}
          required
        />
      </Field>

      <Field
        label="Imagem (endereço)"
        name={`${prefix}thumbnailSrc`}
        hint="Endereço completo da imagem. Deixe vazio se ainda não houver."
      >
        <TextInput
          name="thumbnailSrc"
          defaultValue={program?.thumbnail_src}
          placeholder="https://…"
        />
      </Field>

      <div className="md:col-span-2">
        <Field
          label="Descrição da imagem"
          name={`${prefix}thumbnailAlt`}
          hint="Descreva a imagem para quem não pode vê-la."
        >
          <TextInput name="thumbnailAlt" defaultValue={program?.thumbnail_alt} />
        </Field>
      </div>

      <div className="md:col-span-2">
        <Field label="Descrição" name={`${prefix}description`}>
          <TextArea
            name="description"
            rows={3}
            defaultValue={program?.description}
            placeholder="Do que trata o programa."
          />
        </Field>
      </div>
    </div>
  );
}

function CreateProgramForm({ categories }: { categories: AdminCategory[] }) {
  const [state, formAction] = useFormState(createProgramAction, INITIAL);
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
          Novo programa
        </button>
      </>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage message={state.error} tone="error" />
      <FormMessage message={state.success} tone="success" />
      <ProgramFields categories={categories} />
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>Criar programa</SubmitButton>
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

function ProgramRow({
  program,
  categories,
  deleteAction,
}: {
  program: AdminProgram;
  categories: AdminCategory[];
  /** Acción de borrado del padre: su resultado sobrevive a esta fila. */
  deleteAction: (formData: FormData) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editState, editAction] = useFormState(updateProgramAction, INITIAL);

  return (
    <li className="py-4 border-b border-paper-border dark:border-tv-border last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {program.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-text-secondary mt-0.5">
            {program.category_name} · {program.duration_minutes} min ·{' '}
            {program.slot_count}{' '}
            {program.slot_count === 1 ? 'bloco na grade' : 'blocos na grade'}
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
            <input type="hidden" name="id" value={program.id} />
            <DeleteButton
              confirmMessage={
                program.slot_count > 0
                  ? `Excluir "${program.title}"? Isso também remove ${program.slot_count} bloco(s) da grade.`
                  : `Excluir "${program.title}"?`
              }
            />
          </form>
        </div>
      </div>

      {isEditing && (
        <form action={editAction} className="mt-4 flex flex-col gap-4">
          <input type="hidden" name="id" value={program.id} />
          <FormMessage message={editState.error} tone="error" />
          <FormMessage message={editState.success} tone="success" />
          <ProgramFields program={program} categories={categories} />
          <div>
            <SubmitButton>Salvar alterações</SubmitButton>
          </div>
        </form>
      )}
    </li>
  );
}

export function ProgramsManager({ programs, categories }: Props) {
  const [deleteState, deleteAction] = useFormState(
    deleteProgramAction,
    INITIAL,
  );

  return (
    <>
      <Panel
        title="Novo programa"
        description="Os programas alimentam a grade e a página /programas."
      >
        <CreateProgramForm categories={categories} />
      </Panel>

      <Panel title={`Programas (${programs.length})`}>
        <div className="mb-3 flex flex-col gap-2 empty:mb-0">
          <FormMessage message={deleteState.error} tone="error" />
          <FormMessage message={deleteState.success} tone="success" />
        </div>

        {programs.length === 0 ? (
          <EmptyRow>Nenhum programa cadastrado ainda.</EmptyRow>
        ) : (
          <ul>
            {programs.map((program) => (
              <ProgramRow
                key={program.id}
                program={program}
                categories={categories}
                deleteAction={deleteAction}
              />
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
