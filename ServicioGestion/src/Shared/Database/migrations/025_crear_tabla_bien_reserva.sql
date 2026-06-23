-- Migración 025: Tabla bien_reserva
-- Cada bien asociado a una reserva guarda sus datos inline:
-- descripcion (requerida), valor y tamano (opcionales), categorias (inferidas o pre-registradas).
-- Reemplaza el array productos[] en reserva para poder guardar los datos de cada bien.

CREATE TABLE IF NOT EXISTS bien_reserva (
  id SERIAL PRIMARY KEY,
  reserva_id INTEGER NOT NULL REFERENCES reserva(id) ON DELETE CASCADE,
  producto_id INTEGER REFERENCES producto(id) ON DELETE SET NULL,
  descripcion VARCHAR(500) NOT NULL,
  valor NUMERIC(10,2),
  tamano NUMERIC(10,2),
  categorias TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
