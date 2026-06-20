-- Migración 003: Historial de posiciones GPS por dispositivo

CREATE TABLE IF NOT EXISTS ubicacion_gps (
  id SERIAL PRIMARY KEY,
  dispositivo_id INTEGER NOT NULL,
  vehiculo_matricula VARCHAR(100),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  velocidad DOUBLE PRECISION DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ubicacion_dispositivo_ts
  ON ubicacion_gps(dispositivo_id, timestamp DESC);
