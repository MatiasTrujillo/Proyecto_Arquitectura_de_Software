-- Migración 019: Agregar orígenes y destinos frecuentes a cliente_empresa

ALTER TABLE cliente_empresa
  ADD COLUMN IF NOT EXISTS origenes_frecuentes text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS destinos_frecuentes text[] NOT NULL DEFAULT '{}';
