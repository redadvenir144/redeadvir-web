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
      {/* Container del player con aspect ratio 16:9 y max-height para no ocupar toda la pantalla */}
      <div
        className="relative w-full max-h-[70vh] bg-player-bg rounded-lg overflow-hidden"
        style={{ aspectRatio: '16 / 9' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseMove}
      >
        {/* Video element */}
        <video
          ref={videoRef}
          className={[
            'absolute inset-0 w-full h-full object-contain',
            state === 'live' || state === 'buffering' ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          poster={poster}
          playsInline
          autoPlay
          muted={false}
        />

        {/* Live badge */}
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

      {/* Fallback content cuando hay error */}
      {showFallback && fallbackContent && (
        <div className="mt-6">{fallbackContent}</div>
      )}
    </div>
  );
}
