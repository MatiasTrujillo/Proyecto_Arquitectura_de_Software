-- Migración 005: Crear tabla cliente_empresa

CREATE TABLE IF NOT EXISTS cliente_empresa (
  id SERIAL PRIMARY KEY,
  cedula VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cliente_empresa_cedula ON cliente_empresa(cedula);
