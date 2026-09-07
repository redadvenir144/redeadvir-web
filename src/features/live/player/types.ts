/**
 * Estados del reproductor en vivo.
 * Type union explícito, no booleanos sueltos.
 */
export type PlayerState =
  | 'idle'
  | 'loading'
  | 'live'
  | 'buffering'
  | 'offline'
  | 'networkError'
  | 'serverError'
  | 'unsupported';

/**
 * Mensajes al usuario por estado (pt-BR).
 * Nunca mostramos códigos técnicos.
 */
export const PLAYER_MESSAGES: Record<
  Exclude<PlayerState, 'idle' | 'loading' | 'live' | 'buffering'>,
  { title: string; description: string }
> = {
  offline: {
    title: 'Estamos fora do ar neste momento',
    description: 'Confira a programação do dia enquanto aguarda.',
  },
  networkError: {
    title: 'Verifique sua conexão com a internet',
    description: 'Não foi possível carregar a transmissão.',
  },
  serverError: {
    title: 'Estamos com uma instabilidade técnica',
    description: 'Tente novamente ou acesse pelo aplicativo.',
  },
  unsupported: {
    title: 'Seu navegador não suporta a transmissão',
    description: 'Baixe nosso aplicativo para assistir.',
  },
};

/**
 * Configuración del backoff exponencial.
 */
export const RETRY_CONFIG = {
  /** Delays en ms: 2s, 4s, 8s, 16s */
  delays: [2000, 4000, 8000, 16000],
  /** Máximo de intentos */
  maxAttempts: 5,
} as const;

/**
 * Timeout de carga en ms.
 */
export const LOADING_TIMEOUT_MS = 15000;

/**
 * Intervalo de reintento cuando está offline (30s).
 */
export const OFFLINE_RETRY_INTERVAL_MS = 30000;
