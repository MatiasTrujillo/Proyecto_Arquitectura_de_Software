import { Conductor } from "../Dominio/Conductor";
import pool from '../../Shared/Database/DatabaseConnection';
import { IRepositorioConductor } from "../IDataAccess/IRepositorioConductor";

export class RepositorioConductor implements IRepositorioConductor {
  async crearConductor(cedula: string, nombre: string): Promise<Conductor> {
    const res = await pool.query(
      'INSERT INTO conductor (cedula, nombre) VALUES ($1, $2) RETURNING id, cedula, nombre',
      [cedula, nombre]
    );
    const r = res.rows[0];
    return new Conductor(String(r.id), r.cedula, r.nombre);
  }

  async obtenerConductores(): Promise<Conductor[]> {
    const res = await pool.query('SELECT id, cedula, nombre FROM conductor');
    return res.rows.map((r: any) => new Conductor(String(r.id), r.cedula, r.nombre));
  }

  async obtenerConductorPorId(id: string): Promise<Conductor | undefined> {
    const res = await pool.query('SELECT id, cedula, nombre FROM conductor WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new Conductor(String(r.id), r.cedula, r.nombre);
  }

  async actualizarConductor(id: string, cedula: string, nombre: string): Promise<Conductor | undefined> {
    const res = await pool.query(
      'UPDATE conductor SET cedula = $1, nombre = $2 WHERE id = $3 RETURNING id, cedula, nombre',
      [cedula, nombre, id]
    );
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new Conductor(String(r.id), r.cedula, r.nombre);
  }

  async eliminarConductor(id: string): Promise<boolean> {
    const res = await pool.query('DELETE FROM conductor WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }

  async existe(id: string): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM conductor WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }
}
