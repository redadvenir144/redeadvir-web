'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Hls from 'hls.js';
import {
  type PlayerState,
  RETRY_CONFIG,
  LOADING_TIMEOUT_MS,
} from './types';

interface UseHlsPlayerOptions {
  src: string;
}

interface UseHlsPlayerReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  state: PlayerState;
  retry: () => void;
}

/**
 * Hook para manejar la reproducción HLS con máquina de estados.
 */
export function useHlsPlayer({ src }: UseHlsPlayerOptions): UseHlsPlayerReturn {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const hlsRef = useRef<Hls | null>(null);
  const [state, setState] = useState<PlayerState>('loading');
  const retryCountRef = useRef(0);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mediaRecoveryAttemptedRef = useRef(false);
  // Trigger para reiniciar el efecto
  const [retryTrigger, setRetryTrigger] = useState(0);

  /**
   * Limpia todos los timeouts y recursos.
   */
  const cleanup = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  /**
   * Función interna para programar un reintento.
   */
  const scheduleRetry = useCallback(() => {
    if (retryCountRef.current < RETRY_CONFIG.maxAttempts) {
      const delay = RETRY_CONFIG.delays[
        Math.min(retryCountRef.current, RETRY_CONFIG.delays.length - 1)
      ];
      retryCountRef.current++;

      console.log(
        `[LivePlayer] Retry ${retryCountRef.current}/${RETRY_CONFIG.maxAttempts} in ${delay}ms`
      );

      retryTimeoutRef.current = setTimeout(() => {
        cleanup();
        setState('loading');
        setRetryTrigger((t) => t + 1);
      }, delay);
    } else {
      console.error('[LivePlayer] Max retry attempts reached');
    }
  }, [cleanup]);

  /**
   * Maneja errores del stream con backoff exponencial.
   */
  const handleError = useCallback((errorType: 'network' | 'media' | 'server') => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    // Para errores de media, intentar recuperación una vez
    if (errorType === 'media' && hlsRef.current && !mediaRecoveryAttemptedRef.current) {
      mediaRecoveryAttemptedRef.current = true;
      console.log('[LivePlayer] Attempting media recovery');
      hlsRef.current.recoverMediaError();
      return;
    }

    const newState = errorType === 'network' ? 'networkError' : 'serverError';
    setState(newState);
    scheduleRetry();
  }, [scheduleRetry]);

  /**
   * Reintentar manualmente.
   */
  const retry = useCallback(() => {
    retryCountRef.current = 0;
    mediaRecoveryAttemptedRef.current = false;
    cleanup();
    setState('loading');
    setRetryTrigger((t) => t + 1);
  }, [cleanup]);

  /**
   * Efecto principal para cargar el stream.
   */
  useEffect(() => {
    if (!src) return;

    const video = videoRef.current;
    if (!video) return;

    setState('loading');
    mediaRecoveryAttemptedRef.current = false;

    // Timeout de carga (15s)
    loadingTimeoutRef.current = setTimeout(() => {
      console.error('[LivePlayer] Loading timeout exceeded');
      setState('networkError');
      scheduleRetry();
    }, LOADING_TIMEOUT_MS);

    // Detectar soporte
    const supportsNativeHls = video.canPlayType('application/vnd.apple.mpegurl') !== '';
    const supportsMse = Hls.isSupported();

    console.log('[LivePlayer] Support check:', { supportsNativeHls, supportsMse, src });

    if (!supportsNativeHls && !supportsMse) {
      console.error('[LivePlayer] No HLS support detected');
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      setState('unsupported');
      return;
    }

    // Safari/iOS: usar video.src directo
    if (supportsNativeHls && !supportsMse) {
      video.src = src;

      const onCanPlay = () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        setState('live');
        retryCountRef.current = 0;
        video.play().catch(console.error);
      };

      const onError = () => {
        console.error('[LivePlayer] Native HLS error:', video.error);
        handleError('network');
      };

      video.addEventListener('canplay', onCanPlay);
      video.addEventListener('error', onError);
      video.load();

      return () => {
        video.removeEventListener('canplay', onCanPlay);
        video.removeEventListener('error', onError);
      };
    }

    // Usar hls.js
    console.log('[LivePlayer] Initializing hls.js');
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      debug: true, // Habilitar debug temporalmente
    });
    hlsRef.current = hls;

    hls.loadSource(src);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log('[LivePlayer] Manifest parsed, starting playback');
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      setState('live');
      retryCountRef.current = 0;
      video.play().catch((err) => {
        console.warn('[LivePlayer] Autoplay blocked:', err.message);
      });
    });

    hls.on(Hls.Events.ERROR, (_event, data) => {
      console.error('[LivePlayer] HLS error:', data.type, data.details, data.fatal);

      if (data.fatal) {
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          handleError('network');
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          handleError('media');
        } else {
          handleError('server');
        }
      }
    });

    // Eventos de buffering
    const onWaiting = () => {
      setState((prev) => (prev === 'live' ? 'buffering' : prev));
    };

    const onPlaying = () => {
      setState((prev) => (prev === 'buffering' ? 'live' : prev));
    };

    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);

    return () => {
      console.log('[LivePlayer] Cleanup');
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, retryTrigger]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { videoRef, state, retry };
}
