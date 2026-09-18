-- Esquema del admin de REDE ADVIR
-- Idempotente: se puede ejecutar varias veces sin romper nada.

-- ---------------------------------------------------------------------------
-- Acceso
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admin_users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'editor',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT admin_users_role_check CHECK (role IN ('admin', 'editor'))
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_sessions_user_id_idx ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS admin_sessions_expires_at_idx ON admin_sessions(expires_at);

-- ---------------------------------------------------------------------------
-- Contenido
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS categories (
  id   TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS programs (
  id               TEXT PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL DEFAULT '',
  category_id      TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  thumbnail_src    TEXT NOT NULL DEFAULT '',
  thumbnail_alt    TEXT NOT NULL DEFAULT '',
  thumbnail_width  INTEGER NOT NULL DEFAULT 1280,
  thumbnail_height INTEGER NOT NULL DEFAULT 720,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT programs_duration_check CHECK (duration_minutes > 0)
);

-- La grilla se guarda por día de la semana, como en Red ADvenir.
-- day_of_week: 0 = domingo … 6 = sábado (igual que Date#getDay).
CREATE TABLE IF NOT EXISTS schedule_slots (
  id               TEXT PRIMARY KEY,
  program_id       TEXT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  day_of_week      SMALLINT NOT NULL,
  start_hour       SMALLINT NOT NULL,
  start_minute     SMALLINT NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL,
  CONSTRAINT schedule_slots_day_check CHECK (day_of_week BETWEEN 0 AND 6),
  CONSTRAINT schedule_slots_hour_check CHECK (start_hour BETWEEN 0 AND 23),
  CONSTRAINT schedule_slots_minute_check CHECK (start_minute BETWEEN 0 AND 59),
  CONSTRAINT schedule_slots_duration_check CHECK (duration_minutes > 0),
  CONSTRAINT schedule_slots_unique_start UNIQUE (day_of_week, start_hour, start_minute)
);

CREATE INDEX IF NOT EXISTS schedule_slots_day_idx
  ON schedule_slots(day_of_week, start_hour, start_minute);

CREATE TABLE IF NOT EXISTS videos (
  id               TEXT PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL DEFAULT '',
  category_id      TEXT REFERENCES categories(id) ON DELETE SET NULL,
  url              TEXT NOT NULL DEFAULT '',
  thumbnail_src    TEXT NOT NULL DEFAULT '',
  thumbnail_alt    TEXT NOT NULL DEFAULT '',
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  published_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_published     BOOLEAN NOT NULL DEFAULT true,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT videos_duration_check CHECK (duration_seconds >= 0)
);

CREATE INDEX IF NOT EXISTS videos_published_idx ON videos(is_published, published_at DESC);

-- Páginas de texto: Sobre, Doar, políticas.
CREATE TABLE IF NOT EXISTS pages (
  slug          TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  body          TEXT NOT NULL DEFAULT '',
  is_published  BOOLEAN NOT NULL DEFAULT true,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Configuración del sitio y del stream, como pares clave/valor.
CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Notícias
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS news (
  id            TEXT PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  excerpt       TEXT NOT NULL DEFAULT '',
  body          TEXT NOT NULL DEFAULT '',
  author        TEXT NOT NULL DEFAULT '',
  category_id   TEXT REFERENCES categories(id) ON DELETE SET NULL,
  thumbnail_src TEXT NOT NULL DEFAULT '',
  thumbnail_alt TEXT NOT NULL DEFAULT '',
  published_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_published  BOOLEAN NOT NULL DEFAULT true,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS news_published_idx
  ON news(is_published, published_at DESC);
