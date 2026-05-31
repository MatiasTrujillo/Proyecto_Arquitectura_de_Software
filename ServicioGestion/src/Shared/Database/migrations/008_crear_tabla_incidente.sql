-- Migración 008: Crear tabla incidente

CREATE TABLE IF NOT EXISTS incidente (
  id SERIAL PRIMARY KEY,
  descripcion TEXT NOT NULL,
  fecha TIMESTAMP NOT NULL,
  reserva_id VARCHAR(100) NOT NULL,
  estado VARCHAR(50) NOT NULL,
  severidad VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
