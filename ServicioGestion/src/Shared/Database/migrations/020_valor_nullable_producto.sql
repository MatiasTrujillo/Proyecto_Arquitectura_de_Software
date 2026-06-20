-- Migración 020: Hacer valor opcional en producto
ALTER TABLE producto ALTER COLUMN valor DROP NOT NULL;
