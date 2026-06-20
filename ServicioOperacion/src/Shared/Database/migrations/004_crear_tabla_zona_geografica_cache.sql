-- Migración 004: Caché local de zonas geográficas

CREATE TABLE IF NOT EXISTS zona_geografica_cache (
  id INTEGER PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  delimitacion TEXT NOT NULL,
  tipo VARCHAR(20) NOT NULL DEFAULT 'regular'
);
