CREATE TABLE IF NOT EXISTS credenciales (
  id        SERIAL PRIMARY KEY,
  cedula    VARCHAR(30) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol       VARCHAR(50) NOT NULL,
  activa    BOOLEAN NOT NULL DEFAULT true,
  creada_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sesiones (
  token     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cedula    VARCHAR(30) NOT NULL REFERENCES credenciales(cedula) ON DELETE CASCADE,
  activa    BOOLEAN NOT NULL DEFAULT true,
  creada_en TIMESTAMP NOT NULL DEFAULT NOW(),
  expira_en TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);
