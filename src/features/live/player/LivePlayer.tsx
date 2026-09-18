'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { useHlsPlayer } from './useHlsPlayer';
import { PlayerControls } from './PlayerControls';
import { PlayerOverlay } from './PlayerOverlay';

/**
 * URL del stream desde variable de entorno.
 * Fallback a stream de prueba público mientras no tengamos la URL real.
 */
const STREAM_URL =
  process.env.NEXT_PUBLIC_STREAM_URL ||
  // Stream de prueba público (Big Buck Bunny)
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

interface LivePlayerProps {
  /** Contenido a mostrar debajo cuando hay error/offline (ej: grilla del día) */
  fallbackContent?: ReactNode;
  /** Poster del video */
  poster?: string;
  /**
   * URL del stream editada desde el admin. Si viene vacía o no viene,
   * se usa la variable de entorno.
   */
  streamUrl?: string;
}

export function LivePlayer({
  fallbackContent,
  poster,
  streamUrl,
}: LivePlayerProps) {
  const { videoRef, state, retry, isMuted, toggleMute, needsPlayGesture, play } =
    useHlsPlayer({ src: streamUrl || STREAM_URL });
  const [showControls, setShowControls] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  /**
   * Mostrar controles con auto-hide.
   */
  const handleMouseMove = useCallback(() => {
    setShowControls(true);

    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }

    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    setControlsTimeout(timeout);
  }, [controlsTimeout]);

  const handleMouseLeave = useCallback(() => {
    setShowControls(false);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
  }, [controlsTimeout]);

  // Determinar si mostrar el fallback content
  const showFallback =
    state === 'offline' ||
    state === 'networkError' ||
    state === 'serverError' ||
    state === 'unsupported';

  return (
    <div className="w-full">
      {/* Container con glow effect */}
      <div className="relative group">
        {/* Glow effect behind player */}
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-600/20 via-brand-400/10 to-brand-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

        {/* Player container */}
        <div className="relative overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
          {/* Video area */}
          <div
            className="relative"
            style={{ aspectRatio: '16 / 9' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseMove}
          >
            {/* Video element */}
            <video
              ref={videoRef}
              className={[
                'absolute inset-0 w-full h-full object-cover',
                state === 'live' || state === 'buffering' ? 'opacity-100' : 'opacity-0',
              ].join(' ')}
              poster={poster}
              playsInline
              autoPlay
              // Arranca en silencio a propósito: ningún navegador permite la
              // reproducción automática con sonido. El aviso de abajo deja
              // activarlo con un toque.
              muted
            />

            {/* El navegador bloqueó incluso el arranque en silencio */}
            {state === 'live' && needsPlayGesture && (
              <button
                type="button"
                onClick={play}
                aria-label="Reproduzir transmissão ao vivo"
                className={[
                  'absolute inset-0 z-20',
                  'flex flex-col items-center justify-center gap-3',
                  'bg-black/50 text-white',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white',
                ].join(' ')}
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-brand-700">
                  <svg className="h-8 w-8 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="font-semibold">Assistir ao vivo</span>
              </button>
            )}

            {/* Sonido: arriba a la derecha, sobre el vídeo */}
            {(state === 'live' || state === 'buffering') && (
              <button
                type="button"
                onClick={toggleMute}
                aria-pressed={!isMuted}
                aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
                className={[
                  'absolute top-4 right-4 z-20',
                  'inline-flex items-center gap-2 min-h-11 px-4 rounded-full',
                  'bg-black/70 hover:bg-black/85 backdrop-blur-sm',
                  'text-white text-sm font-semibold',
                  'transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                ].join(' ')}
              >
                {isMuted ? (
                  <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm18.5-.5L20 7l-2.5 2.5L15 7l-1.5 1.5L16 11l-2.5 2.5L15 15l2.5-2.5L20 15l1.5-1.5L19 11l2.5-2.5z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.05A4.47 4.47 0 0016.5 12zM14 3.23v2.06a7 7 0 010 13.42v2.06a9 9 0 000-17.54z" />
                  </svg>
                )}
                {/* El texto solo cuando hay algo que pedir al usuario */}
                {isMuted && <span>Ativar som</span>}
              </button>
            )}

            {/* Overlay de estados */}
            <PlayerOverlay state={state} onRetry={retry} />

            {/* Controles */}
            {(state === 'live' || state === 'buffering') && (
              <PlayerControls videoRef={videoRef} isVisible={showControls} />
            )}
          </div>

          {/* Bottom bar - modern style */}
          <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-brand-700 to-brand-600 px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Live indicator */}
              <span className="inline-flex items-center gap-2 text-sm font-bold tracking-wide text-white">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-live opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live" />
                </span>
                AO VIVO
              </span>

              {/* Channel info */}
              <span className="hidden sm:inline text-white/60 text-sm">
                Vivensis · Canal 7777
              </span>
            </div>

            {/* Right side - quality indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50">HD</span>
              <div className="w-px h-4 bg-white/20" />
              <span className="text-xs text-white/70">
                Transmissão ao vivo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fallback content cuando hay error */}
      {showFallback && fallbackContent && (
        <div className="mt-6">{fallbackContent}</div>
      )}
    </div>
  );
}
