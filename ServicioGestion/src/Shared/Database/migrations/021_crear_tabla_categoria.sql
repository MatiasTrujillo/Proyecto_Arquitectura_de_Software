CREATE TABLE IF NOT EXISTS categoria (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  nombre_es VARCHAR(100) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categoria (nombre, nombre_es, descripcion) VALUES
  ('electronics',  'electrónica',               'Equipos electrónicos, computadoras, monitores, teléfonos'),
  ('furniture',    'muebles',                   'Sillones, mesas, escritorios, estanterías'),
  ('medications',  'medicamentos',              'Medicamentos, insumos médicos, material hospitalario'),
  ('confidential', 'documentación confidencial','Documentos legales, contratos, expedientes'),
  ('luggage',      'equipaje',                  'Maletas, bolsos, valijas'),
  ('spare_parts',  'repuestos',                 'Repuestos industriales, piezas mecánicas'),
  ('food',         'alimentos',                 'Alimentos perecederos y no perecederos'),
  ('fragile',      'frágil',                    'Objetos frágiles: cerámica, vidrio, arte')
ON CONFLICT (nombre) DO NOTHING;
