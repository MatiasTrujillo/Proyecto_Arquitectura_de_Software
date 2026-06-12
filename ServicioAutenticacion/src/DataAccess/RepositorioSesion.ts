import pool from '../Shared/Database/DatabaseConnection';
import { Sesion } from '../Dominio/Sesion';

export class RepositorioSesion {
  async crear(cedula: string, rol: string): Promise<Sesion> {
    const resultado = await pool.query(
      `INSERT INTO sesiones (cedula)
       VALUES ($1)
       RETURNING token, cedula, activa, expira_en`,
      [cedula]
    );
    const r = resultado.rows[0];
    return new Sesion(r.token, r.cedula, rol, r.activa, r.expira_en);
  }

  async buscarPorToken(token: string): Promise<Sesion | null> {
    const resultado = await pool.query(
      `SELECT s.token, s.cedula, s.activa, s.expira_en, c.rol
       FROM sesiones s
       JOIN credenciales c ON c.cedula = s.cedula
       WHERE s.token = $1`,
      [token]
    );
    if (resultado.rows.length === 0) return null;
    const r = resultado.rows[0];
    return new Sesion(r.token, r.cedula, r.rol, r.activa, r.expira_en);
  }

  async desactivar(token: string): Promise<void> {
    await pool.query(
      'UPDATE sesiones SET activa = false WHERE token = $1',
      [token]
    );
  }
}
