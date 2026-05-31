-- Migración 001: Crear tabla administrador
-- Esta tabla almacena los datos de los administradores del sistema

CREATE TABLE IF NOT EXISTS administrador (
  -- id: identificador único auto-incrementable
  id SERIAL PRIMARY KEY,
  
  -- cedula: número de cédula del administrador (único)
  cedula VARCHAR(50) NOT NULL UNIQUE,
  
  -- nombre: nombre completo del administrador
  nombre VARCHAR(255) NOT NULL,
  
  -- created_at: fecha de creación del registro (se asigna automáticamente)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- updated_at: fecha de la última actualización (se asigna automáticamente)
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear un índice en cedula para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_administrador_cedula ON administrador(cedula);
