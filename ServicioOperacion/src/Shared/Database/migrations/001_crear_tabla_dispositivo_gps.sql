-- Migración 001: Crear tabla dispositivo_gps
-- Esta tabla almacena los dispositivos GPS disponibles

CREATE TABLE IF NOT EXISTS dispositivo_gps (
  id SERIAL PRIMARY KEY,
  ubicacion TEXT
);
