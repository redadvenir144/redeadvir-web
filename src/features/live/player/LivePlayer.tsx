'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { useHlsPlayer } from './useHlsPlayer';
import { PlayerControls } from './PlayerControls';
import { PlayerOverlay } from './PlayerOverlay';
import { LiveBadge } from '@/components/ui';

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
}

export function LivePlayer({ fallbackContent, poster }: LivePlayerProps) {
  const { videoRef, state, retry } = useHlsPlayer({ src: STREAM_URL });
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
              muted={false}
            />

            {/* Live badge - top left */}
            {state === 'live' && (
              <div className="absolute top-4 left-4 z-10">
                <LiveBadge />
              </div>
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
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
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
