import pool from '../Shared/Database/DatabaseConnection';
import { Credencial } from '../Dominio/Credencial';

export class RepositorioCredencial {
  async buscarPorCedula(cedula: string): Promise<Credencial | null> {
    const resultado = await pool.query(
      'SELECT id, cedula, password_hash, rol, activa FROM credenciales WHERE cedula = $1',
      [cedula]
    );
    if (resultado.rows.length === 0) return null;
    const r = resultado.rows[0];
    return new Credencial(r.id, r.cedula, r.password_hash, r.rol, r.activa);
  }

  async crear(cedula: string, passwordHash: string, rol: string): Promise<Credencial> {
    const resultado = await pool.query(
      'INSERT INTO credenciales (cedula, password_hash, rol) VALUES ($1, $2, $3) RETURNING id, cedula, password_hash, rol, activa',
      [cedula, passwordHash, rol]
    );
    const r = resultado.rows[0];
    return new Credencial(r.id, r.cedula, r.password_hash, r.rol, r.activa);
  }

  async existe(cedula: string): Promise<boolean> {
    const resultado = await pool.query(
      'SELECT 1 FROM credenciales WHERE cedula = $1',
      [cedula]
    );
    return resultado.rows.length > 0;
  }
}
