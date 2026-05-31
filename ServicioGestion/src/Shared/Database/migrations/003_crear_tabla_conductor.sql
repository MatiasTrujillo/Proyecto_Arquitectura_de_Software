-- Migración 003: Crear tabla conductor

CREATE TABLE IF NOT EXISTS conductor (
  id SERIAL PRIMARY KEY,
  cedula VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_conductor_cedula ON conductor(cedula);
