import pool from './DatabaseConnection';

const CONDUCTORES = [
  { cedula: 'conductor1', nombre: 'Carlos Méndez',   email: 'conductor1@move.internal' },
  { cedula: 'conductor2', nombre: 'Ana Rodríguez',   email: 'conductor2@move.internal' },
  { cedula: 'conductor3', nombre: 'Pedro Gómez',     email: 'conductor3@move.internal' },
  { cedula: 'conductor4', nombre: 'Laura Díaz',      email: 'conductor4@move.internal' },
];

const OPERADORES = [
  { cedula: 'operador1', nombre: 'Martina López',  email: 'operador1@move.internal' },
  { cedula: 'operador2', nombre: 'Gonzalo Pérez',  email: 'operador2@move.internal' },
];

export async function ejecutarSeed(): Promise<void> {
  try {
    await pool.query(`
      INSERT INTO administrador (cedula, nombre, email)
      VALUES ('admin', 'Administrador del Sistema', 'admin@move.internal')
      ON CONFLICT (cedula) DO UPDATE SET email = EXCLUDED.email, nombre = EXCLUDED.nombre
    `);

    for (const c of CONDUCTORES) {
      await pool.query(
        `INSERT INTO conductor (cedula, nombre, email) VALUES ($1, $2, $3) ON CONFLICT (cedula) DO NOTHING`,
        [c.cedula, c.nombre, c.email]
      );
    }

    for (const o of OPERADORES) {
      await pool.query(
        `INSERT INTO operador (cedula, nombre, email) VALUES ($1, $2, $3) ON CONFLICT (cedula) DO NOTHING`,
        [o.cedula, o.nombre, o.email]
      );
    }
  } catch {
    // seed no bloquea el arranque
  }
}
