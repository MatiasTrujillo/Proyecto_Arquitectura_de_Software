INSERT INTO administrador (cedula, nombre)
VALUES ('admin', 'Administrador del Sistema')
ON CONFLICT (cedula) DO NOTHING;
