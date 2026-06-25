-- Migración 008: Limpia todos los datos existentes una sola vez.
-- La tabla _seed_reset_v1 actúa como bandera: si existe, no vuelve a truncar.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = '_seed_reset_v1'
  ) THEN
    TRUNCATE TABLE alerta, ubicacion_gps, zona_geografica_cache, vehiculo, dispositivo_gps
    RESTART IDENTITY CASCADE;

    CREATE TABLE _seed_reset_v1 (done_at TIMESTAMP DEFAULT NOW());
  END IF;
END $$;
