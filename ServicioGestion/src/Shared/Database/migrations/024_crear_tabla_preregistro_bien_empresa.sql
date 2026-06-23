-- Migración 024: Tabla preregistro_bien_empresa (F3)
-- Cada ClienteEmpresa asocia un producto del catálogo con su descripción,
-- valor, tamaño y categoría MOVE. Es privado por empresa.

CREATE TABLE IF NOT EXISTS preregistro_bien_empresa (
  id SERIAL PRIMARY KEY,
  cliente_empresa_id VARCHAR(100) NOT NULL,
  producto_id INTEGER NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  descripcion VARCHAR(500) NOT NULL,
  valor NUMERIC(10,2),
  tamano NUMERIC(10,2),
  categoria VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (cliente_empresa_id, producto_id)
);
