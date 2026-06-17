-- Migración 013: Agregar conductor_id a incidente

ALTER TABLE incidente ADD COLUMN IF NOT EXISTS conductor_id VARCHAR(100);
