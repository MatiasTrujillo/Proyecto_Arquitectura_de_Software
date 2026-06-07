-- Migración 002: Crear tabla vehiculo
-- Esta tabla almacena los vehículos y la referencia al dispositivo GPS como texto

CREATE TABLE IF NOT EXISTS vehiculo (
  id SERIAL PRIMARY KEY,
  matricula TEXT,
  tipo TEXT,
  capacidad INTEGER,
  dispositivo_gps TEXT
);
