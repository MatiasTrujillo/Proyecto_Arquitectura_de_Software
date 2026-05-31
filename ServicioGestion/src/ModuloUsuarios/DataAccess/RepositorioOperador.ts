import pool from '../../Shared/Database/DatabaseConnection';
import { Operador } from "../Dominio/Operador";
import { IRepositorioOperador } from "../IDataAccess/IRepositorioOperador";

export class RepositorioOperador implements IRepositorioOperador {
  async crearOperador(cedula: string, nombre: string): Promise<Operador> {
    const res = await pool.query(
      'INSERT INTO operador (cedula, nombre) VALUES ($1, $2) RETURNING id, cedula, nombre',
      [cedula, nombre]
    );
    const r = res.rows[0];
    return new Operador(String(r.id), r.cedula, r.nombre);
  }

  async obtenerOperadores(): Promise<Operador[]> {
    const res = await pool.query('SELECT id, cedula, nombre FROM operador');
    return res.rows.map((r: any) => new Operador(String(r.id), r.cedula, r.nombre));
  }

  async obtenerOperadorPorId(id: string): Promise<Operador | undefined> {
    const res = await pool.query('SELECT id, cedula, nombre FROM operador WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new Operador(String(r.id), r.cedula, r.nombre);
  }

  async actualizarOperador(id: string, cedula: string, nombre: string): Promise<Operador | undefined> {
    const res = await pool.query(
      'UPDATE operador SET cedula = $1, nombre = $2 WHERE id = $3 RETURNING id, cedula, nombre',
      [cedula, nombre, id]
    );
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new Operador(String(r.id), r.cedula, r.nombre);
  }

  async eliminarOperador(id: string): Promise<boolean> {
    const res = await pool.query('DELETE FROM operador WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }

  async existe(id: string): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM operador WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }
}
