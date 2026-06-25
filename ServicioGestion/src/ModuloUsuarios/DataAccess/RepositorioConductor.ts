import { Conductor } from "../Dominio/Conductor";
import pool from '../../Shared/Database/DatabaseConnection';
import { IRepositorioConductor } from "../IDataAccess/IRepositorioConductor";

export class RepositorioConductor implements IRepositorioConductor {
  async crearConductor(cedula: string, nombre: string, email?: string): Promise<Conductor> {
    const res = await pool.query(
      'INSERT INTO conductor (cedula, nombre, email) VALUES ($1, $2, $3) RETURNING id, cedula, nombre, email',
      [cedula, nombre, email ?? null]
    );
    const r = res.rows[0];
    return new Conductor(String(r.id), r.cedula, r.nombre, r.email);
  }

  async obtenerConductores(): Promise<Conductor[]> {
    const res = await pool.query('SELECT id, cedula, nombre, email FROM conductor');
    return res.rows.map((r: any) => new Conductor(String(r.id), r.cedula, r.nombre, r.email));
  }

  async obtenerConductoresDisponibles(): Promise<Conductor[]> {
    const res = await pool.query(`
      SELECT id, cedula, nombre, email FROM conductor
      WHERE cedula NOT IN (
        SELECT conductor FROM viaje WHERE estado = 'En curso' AND conductor IS NOT NULL AND conductor <> ''
      )
      ORDER BY nombre ASC
    `);
    return res.rows.map((r: any) => new Conductor(String(r.id), r.cedula, r.nombre, r.email));
  }

  async obtenerConductorPorId(id: string): Promise<Conductor | undefined> {
    const res = await pool.query('SELECT id, cedula, nombre, email FROM conductor WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new Conductor(String(r.id), r.cedula, r.nombre, r.email);
  }

  async actualizarConductor(id: string, cedula: string, nombre: string): Promise<Conductor | undefined> {
    const res = await pool.query(
      'UPDATE conductor SET cedula = $1, nombre = $2 WHERE id = $3 RETURNING id, cedula, nombre, email',
      [cedula, nombre, id]
    );
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new Conductor(String(r.id), r.cedula, r.nombre, r.email);
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
