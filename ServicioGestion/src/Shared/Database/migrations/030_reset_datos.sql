-- Migración 030: Limpia todos los datos existentes una sola vez.
-- La tabla _seed_reset_v1 actúa como bandera: si existe, no vuelve a truncar.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = '_seed_reset_v1'
  ) THEN
    TRUNCATE TABLE
      correo,
      bien_reserva,
      preregistro_bien_empresa,
      viaje,
      incidente,
      pago,
      reserva,
      conductor,
      operador,
      administrador,
      cliente_personal,
      cliente_empresa,
      producto,
      zona_geografica
    RESTART IDENTITY CASCADE;

    CREATE TABLE _seed_reset_v1 (done_at TIMESTAMP DEFAULT NOW());
  END IF;
END $$;
