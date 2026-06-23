-- Migración 020: Hacer valor opcional en producto (idempotente)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='producto' AND column_name='valor') THEN
    ALTER TABLE producto ALTER COLUMN valor DROP NOT NULL;
  END IF;
END;
$$;
