import pool from '../../Shared/Database/DatabaseConnection';
import { IRepositorioClientePersonal } from "../IDataAccess/IRepositorioClientePersonal";
import { ClientePersonal } from "../Dominio/ClientePersonal";

export class RepositorioClientePersonal implements IRepositorioClientePersonal {
  async crearClientePersonal(cedula: string, nombre: string, email?: string): Promise<ClientePersonal> {
    const res = await pool.query(
      'INSERT INTO cliente_personal (cedula, nombre, email) VALUES ($1, $2, $3) RETURNING id, cedula, nombre, email',
      [cedula, nombre, email ?? null]
    );
    const r = res.rows[0];
    return new ClientePersonal(String(r.id), r.cedula, r.nombre, r.email);
  }

  async obtenerClientePersonales(): Promise<ClientePersonal[]> {
    const res = await pool.query('SELECT id, cedula, nombre, email FROM cliente_personal');
    return res.rows.map((r: any) => new ClientePersonal(String(r.id), r.cedula, r.nombre, r.email));
  }

  async obtenerClientePersonalPorId(id: string): Promise<ClientePersonal | undefined> {
    const res = await pool.query('SELECT id, cedula, nombre, email FROM cliente_personal WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new ClientePersonal(String(r.id), r.cedula, r.nombre, r.email);
  }

  async actualizarClientePersonal(id: string, cedula: string, nombre: string): Promise<ClientePersonal | undefined> {
    const res = await pool.query(
      'UPDATE cliente_personal SET cedula = $1, nombre = $2 WHERE id = $3 RETURNING id, cedula, nombre, email',
      [cedula, nombre, id]
    );
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new ClientePersonal(String(r.id), r.cedula, r.nombre, r.email);
  }

  async eliminarClientePersonal(id: string): Promise<boolean> {
    const res = await pool.query('DELETE FROM cliente_personal WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }

  async existe(id: string): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM cliente_personal WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }
}
