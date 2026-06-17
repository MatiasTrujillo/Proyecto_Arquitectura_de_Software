-- Migración 010: Crear tabla reserva

CREATE TABLE IF NOT EXISTS reserva (
  id SERIAL PRIMARY KEY,
  cliente VARCHAR(100) NOT NULL,
  origen VARCHAR(255) NOT NULL,
  destino VARCHAR(255) NOT NULL,
  fecha TIMESTAMP NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
  costo NUMERIC(10,2) NOT NULL DEFAULT 0,
  vehiculo VARCHAR(100) NOT NULL,
  productos TEXT[] NOT NULL DEFAULT '{}',
  conductor VARCHAR(100) NOT NULL,
  categorias TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
