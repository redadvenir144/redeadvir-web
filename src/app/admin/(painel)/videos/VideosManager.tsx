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
  Checkbox,
  SubmitButton,
  DeleteButton,
  FormMessage,
} from '@/components/admin';
import type { ActionState } from '@/lib/admin/form';
import type { AdminVideo, AdminCategory } from '@/lib/admin/queries';
import {
  createVideoAction,
  updateVideoAction,
  deleteVideoAction,
} from './actions';

const INITIAL: ActionState = {};

/** "YYYY-MM-DD" para <input type="date">. */
function toDateInput(value: Date | string): string {
  return new Date(value).toISOString().slice(0, 10);
}

function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return 'sem duração';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}min ${String(seconds).padStart(2, '0')}s`;
}

function VideoFields({
  video,
  categories,
}: {
  video?: AdminVideo;
  categories: AdminCategory[];
}) {
  const prefix = video ? `edit-${video.id}-` : 'new-';
  const totalSeconds = video?.duration_seconds ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <Field label="Título" name={`${prefix}title`}>
          <TextInput name="title" defaultValue={video?.title} required />
        </Field>
      </div>

      <Field
        label="Endereço (slug)"
        name={`${prefix}slug`}
        hint="Deixe vazio para gerar a partir do título."
      >
        <TextInput name="slug" defaultValue={video?.slug} />
      </Field>

      <Field label="Categoria" name={`${prefix}categoryId`}>
        <Select
          name="categoryId"
          defaultValue={video?.category_id ?? ''}
          placeholder="Sem categoria"
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
        />
      </Field>

      <div className="md:col-span-2">
        <Field
          label="Endereço do vídeo"
          name={`${prefix}url`}
          hint="Link do YouTube ou endereço do arquivo. Deixe vazio se ainda não houver."
        >
          <TextInput name="url" defaultValue={video?.url} placeholder="https://…" />
        </Field>
      </div>

      <Field label="Duração — minutos" name={`${prefix}durationMinutes`}>
        <TextInput
          name="durationMinutes"
          type="number"
          min={0}
          defaultValue={Math.floor(totalSeconds / 60)}
        />
      </Field>

      <Field label="Duração — segundos" name={`${prefix}durationSeconds`}>
        <TextInput
          name="durationSeconds"
          type="number"
          min={0}
          max={59}
          defaultValue={totalSeconds % 60}
        />
      </Field>

      <Field label="Data de publicação" name={`${prefix}publishedAt`}>
        <TextInput
          name="publishedAt"
          type="date"
          defaultValue={
            video ? toDateInput(video.published_at) : toDateInput(new Date())
          }
        />
      </Field>

      <Field label="Imagem (endereço)" name={`${prefix}thumbnailSrc`}>
        <TextInput
          name="thumbnailSrc"
          defaultValue={video?.thumbnail_src}
          placeholder="https://…"
        />
      </Field>

      <div className="md:col-span-2">
        <Field
          label="Descrição da imagem"
          name={`${prefix}thumbnailAlt`}
          hint="Descreva a imagem para quem não pode vê-la."
        >
          <TextInput name="thumbnailAlt" defaultValue={video?.thumbnail_alt} />
        </Field>
      </div>

      <div className="md:col-span-2">
        <Field label="Descrição" name={`${prefix}description`}>
          <TextArea name="description" rows={3} defaultValue={video?.description} />
        </Field>
      </div>

      <div className="md:col-span-2">
        <Checkbox
          name="isPublished"
          label="Publicado (aparece em /videos)"
          defaultChecked={video ? video.is_published : true}
        />
      </div>
    </div>
  );
}

function CreateVideoForm({ categories }: { categories: AdminCategory[] }) {
  const [state, formAction] = useFormState(createVideoAction, INITIAL);
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
          Novo vídeo
        </button>
      </>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage message={state.error} tone="error" />
      <FormMessage message={state.success} tone="success" />
      <VideoFields categories={categories} />
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>Salvar vídeo</SubmitButton>
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

function VideoRow({
  video,
  categories,
  deleteAction,
}: {
  video: AdminVideo;
  categories: AdminCategory[];
  /** Acción de borrado del padre: su resultado sobrevive a esta fila. */
  deleteAction: (formData: FormData) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editState, editAction] = useFormState(updateVideoAction, INITIAL);

  return (
    <li className="py-4 border-b border-paper-border dark:border-tv-border last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {video.title}
            </h3>
            {!video.is_published && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                Rascunho
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-text-secondary mt-0.5">
            {video.category_name ?? 'Sem categoria'} ·{' '}
            {formatDuration(video.duration_seconds)} ·{' '}
            {new Date(video.published_at).toLocaleDateString('pt-BR')}
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
            <input type="hidden" name="id" value={video.id} />
            <DeleteButton confirmMessage={`Excluir "${video.title}"?`} />
          </form>
        </div>
      </div>

      {isEditing && (
        <form action={editAction} className="mt-4 flex flex-col gap-4">
          <input type="hidden" name="id" value={video.id} />
          <FormMessage message={editState.error} tone="error" />
          <FormMessage message={editState.success} tone="success" />
          <VideoFields video={video} categories={categories} />
          <div>
            <SubmitButton>Salvar alterações</SubmitButton>
          </div>
        </form>
      )}
    </li>
  );
}

export function VideosManager({
  videos,
  categories,
}: {
  videos: AdminVideo[];
  categories: AdminCategory[];
}) {
  const [deleteState, deleteAction] = useFormState(deleteVideoAction, INITIAL);

  return (
    <>
      <Panel title="Novo vídeo">
        <CreateVideoForm categories={categories} />
      </Panel>

      <Panel title={`Vídeos (${videos.length})`}>
        <div className="mb-3 flex flex-col gap-2 empty:mb-0">
          <FormMessage message={deleteState.error} tone="error" />
          <FormMessage message={deleteState.success} tone="success" />
        </div>

        {videos.length === 0 ? (
          <EmptyRow>Nenhum vídeo cadastrado ainda.</EmptyRow>
        ) : (
          <ul>
            {videos.map((video) => (
              <VideoRow
                key={video.id}
                video={video}
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
