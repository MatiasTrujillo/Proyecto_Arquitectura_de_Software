-- Migración 005: Alertas generadas por el sistema GPS

CREATE TABLE IF NOT EXISTS alerta (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  descripcion TEXT NOT NULL,
  vehiculo_matricula VARCHAR(100),
  dispositivo_id INTEGER,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerta_vehiculo ON alerta(vehiculo_matricula);
