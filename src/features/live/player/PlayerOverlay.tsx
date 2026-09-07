'use client';

import Link from 'next/link';
import { type PlayerState, PLAYER_MESSAGES } from './types';
import { Button, Skeleton } from '@/components/ui';
import { APP_LINKS } from '@/lib/config/site';

interface PlayerOverlayProps {
  state: PlayerState;
  onRetry: () => void;
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        className="h-12 w-12 animate-spin text-white"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <p className="text-white text-sm">Carregando transmissão...</p>
    </div>
  );
}

function ErrorOverlay({
  title,
  description,
  onRetry,
  showAppLink = false,
}: {
  title: string;
  description: string;
  onRetry: () => void;
  showAppLink?: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 max-w-sm">
      {/* Icono de error */}
      <svg
        className="h-12 w-12 text-white/80 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>

      <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
      <p className="text-white/70 text-sm mb-6">{description}</p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button variant="primary" onClick={onRetry}>
          Tentar novamente
        </Button>

        {showAppLink && (
          <a
            href={APP_LINKS.android}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'inline-flex items-center justify-center gap-2',
              'px-4 py-2.5 min-h-11',
              'bg-white/10 text-white font-medium rounded-lg',
              'hover:bg-white/20',
              'transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black',
            ].join(' ')}
          >
            Baixar o app
          </a>
        )}
      </div>
    </div>
  );
}

function UnsupportedOverlay() {
  return (
    <div className="flex flex-col items-center text-center p-6 max-w-sm">
      <svg
        className="h-12 w-12 text-white/80 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
        />
      </svg>

      <h3 className="text-white text-lg font-semibold mb-2">
        {PLAYER_MESSAGES.unsupported.title}
      </h3>
      <p className="text-white/70 text-sm mb-6">
        {PLAYER_MESSAGES.unsupported.description}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <a
          href={APP_LINKS.android}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            'inline-flex items-center justify-center gap-2',
            'px-4 py-2.5 min-h-11',
            'bg-brand-600 text-white font-medium rounded-lg',
            'hover:bg-brand-700',
            'transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
          ].join(' ')}
        >
          Android
        </a>
        <a
          href={APP_LINKS.ios}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            'inline-flex items-center justify-center gap-2',
            'px-4 py-2.5 min-h-11',
            'bg-brand-600 text-white font-medium rounded-lg',
            'hover:bg-brand-700',
            'transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
          ].join(' ')}
        >
          iOS
        </a>
      </div>
    </div>
  );
}

function BufferingOverlay() {
  return (
    <div className="bg-black/50 flex items-center justify-center">
      <svg
        className="h-12 w-12 animate-spin text-white"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Carregando"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

function OfflineOverlay({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <svg
        className="h-12 w-12 text-white/80 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>

      <h3 className="text-white text-lg font-semibold mb-2">
        {PLAYER_MESSAGES.offline.title}
      </h3>
      <p className="text-white/70 text-sm mb-6">
        {PLAYER_MESSAGES.offline.description}
      </p>

      <Link
        href="/programacao"
        className={[
          'inline-flex items-center justify-center gap-2',
          'px-4 py-2.5 min-h-11',
          'bg-brand-600 text-white font-medium rounded-lg',
          'hover:bg-brand-700',
          'transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
        ].join(' ')}
      >
        Ver programação
      </Link>
    </div>
  );
}

export function PlayerOverlay({ state, onRetry }: PlayerOverlayProps) {
  // Estados sin overlay
  if (state === 'idle' || state === 'live') {
    return null;
  }

  // Buffering: overlay translúcido sin ocultar el video
  if (state === 'buffering') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <BufferingOverlay />
      </div>
    );
  }

  // Estados con overlay completo
  return (
    <div className="absolute inset-0 bg-player-bg flex items-center justify-center">
      {state === 'loading' && <LoadingSpinner />}

      {state === 'offline' && <OfflineOverlay onRetry={onRetry} />}

      {state === 'networkError' && (
        <ErrorOverlay
          title={PLAYER_MESSAGES.networkError.title}
          description={PLAYER_MESSAGES.networkError.description}
          onRetry={onRetry}
        />
      )}

      {state === 'serverError' && (
        <ErrorOverlay
          title={PLAYER_MESSAGES.serverError.title}
          description={PLAYER_MESSAGES.serverError.description}
          onRetry={onRetry}
          showAppLink
        />
      )}

      {state === 'unsupported' && <UnsupportedOverlay />}
    </div>
  );
}
