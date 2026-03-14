CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role          AS ENUM ('customer', 'admin');
CREATE TYPE vehicle_category   AS ENUM ('sports', 'suv', 'sedan', 'convertible', 'coupe');
CREATE TYPE transmission_type  AS ENUM ('automatic', 'manual');
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status     AS ENUM ('pending', 'paid', 'refunded');

-- ─────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────
CREATE TABLE users (
  id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  phone         VARCHAR(20),
  role          user_role    NOT NULL DEFAULT 'customer',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ─────────────────────────────────────────
-- VEHICLES
-- ─────────────────────────────────────────
CREATE TABLE vehicles (
  id           UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
  make         VARCHAR(100)     NOT NULL,
  model        VARCHAR(100)     NOT NULL,
  year         SMALLINT         NOT NULL,
  category     vehicle_category NOT NULL,
  transmission transmission_type NOT NULL DEFAULT 'automatic',
  seats        SMALLINT         NOT NULL DEFAULT 2,
  daily_rate   NUMERIC(10, 2)   NOT NULL,
  description  TEXT,
  is_available BOOLEAN          NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicles_category     ON vehicles(category);
CREATE INDEX idx_vehicles_is_available ON vehicles(is_available);
CREATE INDEX idx_vehicles_daily_rate   ON vehicles(daily_rate);

-- ─────────────────────────────────────────
-- VEHICLE IMAGES
-- ─────────────────────────────────────────
CREATE TABLE vehicle_images (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id    UUID        NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  s3_key        TEXT        NOT NULL,
  url           TEXT        NOT NULL,
  is_primary    BOOLEAN     NOT NULL DEFAULT FALSE,
  display_order SMALLINT    NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);

-- Only one primary image per vehicle
CREATE UNIQUE INDEX idx_vehicle_images_one_primary
  ON vehicle_images(vehicle_id)
  WHERE is_primary = TRUE;

-- ─────────────────────────────────────────
-- RESERVATIONS
-- ─────────────────────────────────────────
CREATE TABLE reservations (
  id         UUID               PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID               NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  vehicle_id UUID               NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  start_date DATE               NOT NULL,
  end_date   DATE               NOT NULL,
  total_days SMALLINT           NOT NULL,
  total_cost NUMERIC(10, 2)     NOT NULL,
  status     reservation_status NOT NULL DEFAULT 'pending',
  notes      TEXT,
  created_at TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ        NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_dates      CHECK (end_date > start_date),
  CONSTRAINT chk_total_days CHECK (total_days > 0),
  CONSTRAINT chk_total_cost CHECK (total_cost > 0)
);

CREATE INDEX idx_reservations_user_id       ON reservations(user_id);
CREATE INDEX idx_reservations_vehicle_id    ON reservations(vehicle_id);
CREATE INDEX idx_reservations_status        ON reservations(status);
CREATE INDEX idx_reservations_vehicle_dates ON reservations(vehicle_id, start_date, end_date);

-- ─────────────────────────────────────────
-- PAYMENTS (optional scaffold)
-- ─────────────────────────────────────────
CREATE TABLE payments (
  id             UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID           NOT NULL REFERENCES reservations(id) ON DELETE RESTRICT,
  amount         NUMERIC(10, 2) NOT NULL,
  status         payment_status NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(50),
  transaction_id TEXT UNIQUE,
  paid_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_reservation_id ON payments(reservation_id);
