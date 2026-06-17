-- Migración 014: Agregar reserva_id a pago

ALTER TABLE pago ADD COLUMN IF NOT EXISTS reserva_id VARCHAR(100);
