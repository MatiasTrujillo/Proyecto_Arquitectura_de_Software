-- Migración 023: Rediseñar tabla producto — solo id y nombre
-- El admin solo define el nombre del bien como identificador compartido.
-- descripcion, valor, tamano y categoria se trasladan a bien_reserva y preregistro_bien_empresa.

DO $$
BEGIN
  -- Eliminar columnas que ya no pertenecen al catálogo de admin
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='producto' AND column_name='descripcion') THEN
    ALTER TABLE producto DROP COLUMN descripcion;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='producto' AND column_name='valor') THEN
    ALTER TABLE producto DROP COLUMN valor;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='producto' AND column_name='tamano') THEN
    ALTER TABLE producto DROP COLUMN tamano;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='producto' AND column_name='categoria') THEN
    ALTER TABLE producto DROP COLUMN categoria;
  END IF;

  -- Agregar columna nombre si no existe (era descripcion antes)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='producto' AND column_name='nombre') THEN
    ALTER TABLE producto ADD COLUMN nombre VARCHAR(500) NOT NULL DEFAULT 'Sin nombre';
  END IF;
END;
$$;
