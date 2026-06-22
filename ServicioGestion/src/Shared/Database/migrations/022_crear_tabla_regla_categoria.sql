CREATE TABLE IF NOT EXISTS regla_categoria (
  id SERIAL PRIMARY KEY,
  categoria_id INTEGER NOT NULL REFERENCES categoria(id),
  requiere_monitoreo BOOLEAN NOT NULL DEFAULT false,
  genera_alertas BOOLEAN NOT NULL DEFAULT false,
  recargo_porcentaje NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(categoria_id)
);
