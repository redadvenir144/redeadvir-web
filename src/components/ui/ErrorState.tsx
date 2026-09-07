import type { ReactNode } from 'react';

interface ErrorStateProps {
  /** Icono opcional (componente React) */
  icon?: ReactNode;
  /** Título del error (amigable, nunca técnico) */
  title: string;
  /** Descripción con contexto o sugerencia */
  description: string;
  /** Acción principal (botón de reintentar, enlace alternativo) */
  action: ReactNode;
  /** Acción secundaria opcional */
  secondaryAction?: ReactNode;
}

/**
 * Estado de error con acción de recuperación.
 * El usuario nunca ve mensajes técnicos — siempre hay una salida.
 * Textos en pt-BR.
 */
export function ErrorState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      role="alert"
    >
      {icon && (
        <div className="mb-4 text-text-muted" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-text-secondary mb-6 max-w-sm">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="min-h-11 min-w-11 flex items-center justify-center">
          {action}
        </div>
        {secondaryAction && (
          <div className="min-h-11 min-w-11 flex items-center justify-center">
            {secondaryAction}
          </div>
        )}
      </div>
    </div>
  );
}

/** Icono de error de red */
export function NetworkErrorIcon() {
  return (
    <svg
      className="h-12 w-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18"
      />
    </svg>
  );
}

/** Icono de error genérico */
export function GenericErrorIcon() {
  return (
    <svg
      className="h-12 w-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
}
