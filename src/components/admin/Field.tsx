import type { ReactNode } from 'react';

const inputClasses = [
  'w-full min-h-11 px-3 py-2',
  'bg-white dark:bg-tv-bg',
  'border border-gray-300 dark:border-tv-border rounded-lg',
  'text-gray-900 dark:text-white',
  'placeholder:text-gray-400 dark:placeholder:text-text-muted',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-brand-500',
].join(' ');

interface FieldProps {
  label: string;
  name: string;
  /** Texto de ayuda bajo el campo. */
  hint?: string;
  children?: ReactNode;
}

/**
 * Etiqueta + control + ayuda. El `htmlFor`/`id` van siempre emparejados para
 * que pulsar la etiqueta enfoque el campo — importante con dedos grandes en
 * pantallas pequeñas.
 */
export function Field({ label, name, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 dark:text-text-secondary"
      >
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-gray-500 dark:text-text-muted">{hint}</p>
      )}
    </div>
  );
}

interface TextInputProps {
  name: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'number' | 'date';
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  autoComplete?: string;
}

export function TextInput({
  name,
  type = 'text',
  defaultValue,
  placeholder,
  required,
  min,
  max,
  autoComplete,
}: TextInputProps) {
  return (
    <input
      id={name}
      name={name}
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      required={required}
      min={min}
      max={max}
      autoComplete={autoComplete}
      className={inputClasses}
    />
  );
}

interface TextAreaProps {
  name: string;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
}

export function TextArea({
  name,
  defaultValue,
  rows = 6,
  placeholder,
  required,
}: TextAreaProps) {
  return (
    <textarea
      id={name}
      name={name}
      rows={rows}
      defaultValue={defaultValue}
      placeholder={placeholder}
      required={required}
      className={`${inputClasses} resize-y`}
    />
  );
}

interface SelectProps {
  name: string;
  defaultValue?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  name,
  defaultValue,
  required,
  options,
  placeholder,
}: SelectProps) {
  return (
    <select
      id={name}
      name={name}
      defaultValue={defaultValue}
      required={required}
      className={inputClasses}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface CheckboxProps {
  name: string;
  label: string;
  defaultChecked?: boolean;
}

export function Checkbox({ name, label, defaultChecked }: CheckboxProps) {
  return (
    <label
      htmlFor={name}
      className="inline-flex items-center gap-3 min-h-11 cursor-pointer"
    >
      <input
        id={name}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-5 w-5 rounded border-gray-300 dark:border-tv-border text-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500"
      />
      <span className="text-sm text-gray-700 dark:text-text-secondary">
        {label}
      </span>
    </label>
  );
}
