-- Migración 011: Crear tabla vehiculo

CREATE TABLE IF NOT EXISTS vehiculo (
  id SERIAL PRIMARY KEY,
  matricula VARCHAR(20) NOT NULL UNIQUE,
  tipo VARCHAR(50) NOT NULL,
  capacidad INTEGER NOT NULL,
  dispositivo_gps VARCHAR(100),
  disponible BOOLEAN NOT NULL DEFAULT TRUE,
  caracteristicas JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
