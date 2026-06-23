-- Migración 026: Tabla de correos internos (notificaciones al cliente)
CREATE TABLE IF NOT EXISTS correo (
  id SERIAL PRIMARY KEY,
  cliente VARCHAR(100) NOT NULL,
  reserva_id INTEGER REFERENCES reserva(id),
  asunto VARCHAR(255) NOT NULL,
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
