-- Migración 015: Vehiculo y conductor opcionales en reserva (se asignan después por el Operador)
ALTER TABLE reserva ALTER COLUMN vehiculo DROP NOT NULL;
ALTER TABLE reserva ALTER COLUMN conductor DROP NOT NULL;
ALTER TABLE reserva ALTER COLUMN vehiculo SET DEFAULT NULL;
ALTER TABLE reserva ALTER COLUMN conductor SET DEFAULT NULL;
