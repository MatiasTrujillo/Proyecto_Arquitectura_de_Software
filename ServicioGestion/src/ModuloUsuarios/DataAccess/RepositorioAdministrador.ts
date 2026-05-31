import pool from '../../Shared/Database/DatabaseConnection';
import { Administrador } from '../Dominio/Administrador';
import { IRepositorioAdministrador } from '../IDataAccess/IRepositorioAdministrador';

export class RepositorioAdministrador implements IRepositorioAdministrador {
  async crearAdministrador(cedula: string, nombre: string): Promise<Administrador> {
    const res = await pool.query(
      'INSERT INTO administrador (cedula, nombre) VALUES ($1, $2) RETURNING id, cedula, nombre',
      [cedula, nombre]
    );
    const row = res.rows[0];
    return new Administrador(String(row.id), row.cedula, row.nombre);
  }

  async obtenerAdministradores(): Promise<Administrador[]> {
    const res = await pool.query('SELECT id, cedula, nombre FROM administrador');
    return res.rows.map(r => new Administrador(String(r.id), r.cedula, r.nombre));
  }

  async obtenerAdministradorPorId(id: string): Promise<Administrador | undefined> {
    const res = await pool.query('SELECT id, cedula, nombre FROM administrador WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new Administrador(String(r.id), r.cedula, r.nombre);
  }

  async actualizarAdministrador(id: string, cedula: string, nombre: string): Promise<Administrador | undefined> {
    const res = await pool.query(
      'UPDATE administrador SET cedula = $1, nombre = $2 WHERE id = $3 RETURNING id, cedula, nombre',
      [cedula, nombre, id]
    );
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new Administrador(String(r.id), r.cedula, r.nombre);
  }

  async eliminarAdministrador(id: string): Promise<boolean> {
    const res = await pool.query('DELETE FROM administrador WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }

  async existe(id: string): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM administrador WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }
}