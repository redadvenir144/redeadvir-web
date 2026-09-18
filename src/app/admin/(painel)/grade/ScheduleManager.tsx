'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Panel,
  EmptyRow,
  Field,
  TextInput,
  Select,
  SubmitButton,
  DeleteButton,
  FormMessage,
} from '@/components/admin';
import type { ActionState } from '@/lib/admin/form';
import type { AdminSlot, AdminProgram } from '@/lib/admin/queries';
import type { DayOfWeek } from '@/types/content';
import {
  createSlotAction,
  updateSlotAction,
  deleteSlotAction,
  copyDayAction,
} from './actions';

const INITIAL: ActionState = {};

export const DAY_LABELS: Record<DayOfWeek, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado',
};

const DAYS: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function DayTabs({ selected }: { selected: DayOfWeek }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function selectDay(day: DayOfWeek) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('dia', String(day));
    router.push(`/admin/grade?${params.toString()}`);
  }

  return (
    <div
      role="tablist"
      aria-label="Dia da semana"
      className="flex gap-1 overflow-x-auto pb-2 mb-4"
    >
      {DAYS.map((day) => {
        const isActive = day === selected;
        return (
          <button
            key={day}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => selectDay(day)}
            className={[
              'flex-shrink-0 min-h-11 px-4 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-600 text-white'
                : 'bg-paper-raised dark:bg-tv-card text-gray-700 dark:text-text-secondary border border-paper-border dark:border-tv-border hover:bg-paper dark:hover:bg-tv-hover',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            ].join(' ')}
          >
            {DAY_LABELS[day]}
          </button>
        );
      })}
    </div>
  );
}

function SlotFields({
  slot,
  day,
  programs,
}: {
  slot?: AdminSlot;
  day: DayOfWeek;
  programs: AdminProgram[];
}) {
  const prefix = slot ? `slot-${slot.id}-` : `new-${day}-`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <input type="hidden" name="dayOfWeek" value={day} />

      <div className="col-span-2">
        <Field label="Programa" name={`${prefix}programId`}>
          <Select
            name="programId"
            defaultValue={slot?.program_id}
            required
            placeholder="Escolha…"
            options={programs.map((program) => ({
              value: program.id,
              label: program.title,
            }))}
          />
        </Field>
      </div>

      <Field label="Hora" name={`${prefix}startHour`}>
        <TextInput
          name="startHour"
          type="number"
          min={0}
          max={23}
          defaultValue={slot?.start_hour ?? 6}
          required
        />
      </Field>

      <Field label="Minuto" name={`${prefix}startMinute`}>
        <TextInput
          name="startMinute"
          type="number"
          min={0}
          max={59}
          defaultValue={slot?.start_minute ?? 0}
          required
        />
      </Field>

      <div className="col-span-2">
        <Field label="Duração (minutos)" name={`${prefix}durationMinutes`}>
          <TextInput
            name="durationMinutes"
            type="number"
            min={1}
            max={720}
            defaultValue={slot?.duration_minutes ?? 30}
            required
          />
        </Field>
      </div>
    </div>
  );
}

function AddSlotForm({
  day,
  programs,
}: {
  day: DayOfWeek;
  programs: AdminProgram[];
}) {
  const [state, formAction] = useFormState(createSlotAction, INITIAL);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage message={state.error} tone="error" />
      <FormMessage message={state.success} tone="success" />
      <SlotFields day={day} programs={programs} />
      <div>
        <SubmitButton>Adicionar bloco</SubmitButton>
      </div>
    </form>
  );
}

function SlotRow({
  slot,
  day,
  programs,
}: {
  slot: AdminSlot;
  day: DayOfWeek;
  programs: AdminProgram[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editState, editAction] = useFormState(updateSlotAction, INITIAL);
  const [deleteState, deleteAction] = useFormState(deleteSlotAction, INITIAL);

  const endMinutes =
    slot.start_hour * 60 + slot.start_minute + slot.duration_minutes;
  const endTime = formatTime(
    Math.floor(endMinutes / 60) % 24,
    endMinutes % 60,
  );

  return (
    <li className="py-3 border-b border-paper-border dark:border-tv-border last:border-b-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="font-semibold text-gray-900 dark:text-white tabular-nums">
            {formatTime(slot.start_hour, slot.start_minute)}
          </span>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {slot.program_title}
            </p>
            <p className="text-xs text-gray-500 dark:text-text-muted">
              até {endTime} · {slot.duration_minutes} min
            </p>
          </div>
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
            <input type="hidden" name="id" value={slot.id} />
            <DeleteButton
              label="Remover"
              confirmMessage={`Remover "${slot.program_title}" das ${formatTime(slot.start_hour, slot.start_minute)}?`}
            />
          </form>
        </div>
      </div>

      <FormMessage message={deleteState.error} tone="error" />

      {isEditing && (
        <form action={editAction} className="mt-4 flex flex-col gap-4">
          <input type="hidden" name="id" value={slot.id} />
          <FormMessage message={editState.error} tone="error" />
          <FormMessage message={editState.success} tone="success" />
          <SlotFields slot={slot} day={day} programs={programs} />
          <div>
            <SubmitButton>Salvar bloco</SubmitButton>
          </div>
        </form>
      )}
    </li>
  );
}

function CopyDayForm({ day }: { day: DayOfWeek }) {
  const [state, formAction] = useFormState(copyDayAction, INITIAL);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Copiar a grade de ${DAY_LABELS[day]} para os dias marcados? A grade atual desses dias será substituída.`,
        );
        if (!confirmed) event.preventDefault();
      }}
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="fromDay" value={day} />
      <FormMessage message={state.error} tone="error" />
      <FormMessage message={state.success} tone="success" />

      <fieldset>
        <legend className="text-sm font-medium text-gray-700 dark:text-text-secondary mb-2">
          Copiar para:
        </legend>
        <div className="flex flex-wrap gap-2">
          {DAYS.filter((target) => target !== day).map((target) => (
            <label
              key={target}
              className="inline-flex items-center gap-2 min-h-11 px-3 rounded-lg border border-paper-border dark:border-tv-border cursor-pointer hover:bg-paper dark:hover:bg-tv-hover"
            >
              <input
                type="checkbox"
                name="toDays"
                value={target}
                className="h-5 w-5 rounded border-gray-300 dark:border-tv-border text-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500"
              />
              <span className="text-sm text-gray-700 dark:text-text-secondary">
                {DAY_LABELS[target]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <SubmitButton variant="danger">Copiar e substituir</SubmitButton>
      </div>
    </form>
  );
}

export function ScheduleManager({
  day,
  slots,
  programs,
}: {
  day: DayOfWeek;
  slots: AdminSlot[];
  programs: AdminProgram[];
}) {
  if (programs.length === 0) {
    return (
      <Panel title="Sem programas">
        <EmptyRow>
          Cadastre pelo menos um programa antes de montar a grade.
        </EmptyRow>
      </Panel>
    );
  }

  return (
    <>
      <DayTabs selected={day} />

      <Panel
        title={`${DAY_LABELS[day]} — ${slots.length} ${slots.length === 1 ? 'bloco' : 'blocos'}`}
        description="Ordenados por horário. Dois blocos não podem começar no mesmo minuto."
      >
        {slots.length === 0 ? (
          <EmptyRow>Nenhum bloco neste dia ainda.</EmptyRow>
        ) : (
          <ul>
            {slots.map((slot) => (
              <SlotRow
                key={slot.id}
                slot={slot}
                day={day}
                programs={programs}
              />
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Adicionar bloco" description={`Em ${DAY_LABELS[day]}.`}>
        <AddSlotForm day={day} programs={programs} />
      </Panel>

      <Panel
        title="Copiar este dia"
        description="Monte um dia e replique nos demais em vez de repetir o trabalho."
      >
        <CopyDayForm day={day} />
      </Panel>
    </>
  );
}
