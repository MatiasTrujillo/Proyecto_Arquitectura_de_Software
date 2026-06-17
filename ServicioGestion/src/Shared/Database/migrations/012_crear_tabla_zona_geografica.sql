-- Migración 012: Crear tabla zona_geografica

CREATE TABLE IF NOT EXISTS zona_geografica (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  delimitacion_geografica TEXT NOT NULL,
  tipo VARCHAR(20) NOT NULL DEFAULT 'regular',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
