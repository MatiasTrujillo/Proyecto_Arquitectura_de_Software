-- Migración 016: Agregar vehiculo y tiene_alertas a viaje (necesario para F18 - filtros en consulta de traslados)
ALTER TABLE viaje ADD COLUMN IF NOT EXISTS vehiculo VARCHAR(100);
ALTER TABLE viaje ADD COLUMN IF NOT EXISTS tiene_alertas BOOLEAN NOT NULL DEFAULT FALSE;
