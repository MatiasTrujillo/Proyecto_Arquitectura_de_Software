import bcrypt from 'bcrypt';
import pool from './DatabaseConnection';

const ADMIN_CEDULA   = process.env.ADMIN_CEDULA    || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD  || 'admin123';

export async function ejecutarSeed(): Promise<void> {
  const existe = await pool.query(
    'SELECT 1 FROM credenciales WHERE cedula = $1',
    [ADMIN_CEDULA]
  );
  if ((existe.rowCount ?? 0) === 0) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await pool.query(
      'INSERT INTO credenciales (cedula, password_hash, rol) VALUES ($1, $2, $3)',
      [ADMIN_CEDULA, hash, 'Administrador']
    );
    console.log(`[seed] Admin por defecto creado — cedula: "${ADMIN_CEDULA}", password: "${ADMIN_PASSWORD}"`);
  }
}
