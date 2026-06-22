DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dispositivo_gps' AND column_name = 'ubicacion'
  ) THEN
    ALTER TABLE dispositivo_gps RENAME COLUMN ubicacion TO nombre;
  END IF;
END $$;
