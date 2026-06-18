-- Identifica los "clientes frecuentes": los 20 con más reservas por semana.
-- Estos clientes reciben procesamiento de alta prioridad (R1: < 600ms).
ALTER TABLE cliente_empresa ADD COLUMN IF NOT EXISTS es_frecuente BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_reserva_cliente ON reserva(cliente);
