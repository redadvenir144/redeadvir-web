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
import type { AdminArticle, AdminCategory } from '@/lib/admin/queries';
import {
  createArticleAction,
  updateArticleAction,
  deleteArticleAction,
} from './actions';

const INITIAL: ActionState = {};

/** "YYYY-MM-DD" para <input type="date">. */
function toDateInput(value: Date | string): string {
  return new Date(value).toISOString().slice(0, 10);
}

function ArticleFields({
  article,
  categories,
}: {
  article?: AdminArticle;
  categories: AdminCategory[];
}) {
  const prefix = article ? `edit-${article.id}-` : 'new-';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <Field label="Título" name={`${prefix}title`}>
          <TextInput name="title" defaultValue={article?.title} required />
        </Field>
      </div>

      <Field
        label="Endereço (slug)"
        name={`${prefix}slug`}
        hint="Deixe vazio para gerar a partir do título."
      >
        <TextInput name="slug" defaultValue={article?.slug} />
      </Field>

      <Field label="Categoria" name={`${prefix}categoryId`}>
        <Select
          name="categoryId"
          defaultValue={article?.category_id ?? ''}
          placeholder="Sem categoria"
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
        />
      </Field>

      <Field label="Autor" name={`${prefix}author`}>
        <TextInput
          name="author"
          defaultValue={article?.author}
          placeholder="Equipe REDE ADVIR"
        />
      </Field>

      <Field label="Data de publicação" name={`${prefix}publishedAt`}>
        <TextInput
          name="publishedAt"
          type="date"
          defaultValue={
            article
              ? toDateInput(article.published_at)
              : toDateInput(new Date())
          }
        />
      </Field>

      <div className="md:col-span-2">
        <Field
          label="Resumo"
          name={`${prefix}excerpt`}
          hint="Duas ou três linhas. É o que aparece na listagem e no Google."
        >
          <TextArea
            name="excerpt"
            rows={2}
            defaultValue={article?.excerpt}
            required
          />
        </Field>
      </div>

      <div className="md:col-span-2">
        <Field
          label="Texto"
          name={`${prefix}body`}
          hint="Deixe uma linha em branco para separar parágrafos."
        >
          <TextArea name="body" rows={12} defaultValue={article?.body} />
        </Field>
      </div>

      <Field
        label="Imagem (endereço)"
        name={`${prefix}thumbnailSrc`}
        hint="Proporção recomendada 1200×630."
      >
        <TextInput
          name="thumbnailSrc"
          defaultValue={article?.thumbnail_src}
          placeholder="https://…"
        />
      </Field>

      <Field
        label="Descrição da imagem"
        name={`${prefix}thumbnailAlt`}
        hint="Descreva a imagem para quem não pode vê-la."
      >
        <TextInput name="thumbnailAlt" defaultValue={article?.thumbnail_alt} />
      </Field>

      <div className="md:col-span-2">
        <Checkbox
          name="isPublished"
          label="Publicada (aparece em /noticias)"
          defaultChecked={article ? article.is_published : true}
        />
      </div>
    </div>
  );
}

function CreateArticleForm({ categories }: { categories: AdminCategory[] }) {
  const [state, formAction] = useFormState(createArticleAction, INITIAL);
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
          Nova notícia
        </button>
      </>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage message={state.error} tone="error" />
      <FormMessage message={state.success} tone="success" />
      <ArticleFields categories={categories} />
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>Salvar notícia</SubmitButton>
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

function ArticleRow({
  article,
  categories,
  deleteAction,
}: {
  article: AdminArticle;
  categories: AdminCategory[];
  /** Acción de borrado del padre: su resultado sobrevive a esta fila. */
  deleteAction: (formData: FormData) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editState, editAction] = useFormState(updateArticleAction, INITIAL);

  return (
    <li className="py-4 border-b border-paper-border dark:border-tv-border last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {article.title}
            </h3>
            {!article.is_published && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                Rascunho
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-text-secondary mt-0.5">
            {article.category_name ?? 'Sem categoria'} ·{' '}
            {new Date(article.published_at).toLocaleDateString('pt-BR')}
            {article.author && <> · {article.author}</>}
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
            <input type="hidden" name="id" value={article.id} />
            <DeleteButton confirmMessage={`Excluir "${article.title}"?`} />
          </form>
        </div>
      </div>

      {isEditing && (
        <form action={editAction} className="mt-4 flex flex-col gap-4">
          <input type="hidden" name="id" value={article.id} />
          <FormMessage message={editState.error} tone="error" />
          <FormMessage message={editState.success} tone="success" />
          <ArticleFields article={article} categories={categories} />
          <div>
            <SubmitButton>Salvar alterações</SubmitButton>
          </div>
        </form>
      )}
    </li>
  );
}

export function NewsManager({
  articles,
  categories,
}: {
  articles: AdminArticle[];
  categories: AdminCategory[];
}) {
  const [deleteState, deleteAction] = useFormState(
    deleteArticleAction,
    INITIAL,
  );

  return (
    <>
      <Panel title="Nova notícia">
        <CreateArticleForm categories={categories} />
      </Panel>

      <Panel title={`Notícias (${articles.length})`}>
        <div className="mb-3 flex flex-col gap-2 empty:mb-0">
          <FormMessage message={deleteState.error} tone="error" />
          <FormMessage message={deleteState.success} tone="success" />
        </div>

        {articles.length === 0 ? (
          <EmptyRow>
            Nenhuma notícia ainda. A página /noticias mostra um aviso até
            existir a primeira.
          </EmptyRow>
        ) : (
          <ul>
            {articles.map((article) => (
              <ArticleRow
                key={article.id}
                article={article}
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
