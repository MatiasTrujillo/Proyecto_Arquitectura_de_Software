import pool from '../../Shared/Database/DatabaseConnection';
import { DispositivoGPS } from "../Domain/DispositivoGPS";
import { IRepositorioDispositivoGPS } from "../IDataAccess/IRepositorioDispositivoGPS";

export class RepositorioDispositivoGPS implements IRepositorioDispositivoGPS {
  async crearDispositivoGPS(ubicacion: string): Promise<DispositivoGPS> {
    const res = await pool.query(
      'INSERT INTO dispositivo_gps (ubicacion) VALUES ($1) RETURNING id, ubicacion',
      [ubicacion]
    );
    const r = res.rows[0];
    return new DispositivoGPS(r.id, r.ubicacion);
  }

  async obtenerDispositivosGPS(): Promise<DispositivoGPS[]> {
    const res = await pool.query('SELECT id, ubicacion FROM dispositivo_gps');
    return res.rows.map((r: any) => new DispositivoGPS(r.id, r.ubicacion));
  }

  async obtenerDispositivoGPSPorId(id: number): Promise<DispositivoGPS | undefined> {
    const res = await pool.query('SELECT id, ubicacion FROM dispositivo_gps WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new DispositivoGPS(r.id, r.ubicacion);
  }

  async actualizarDispositivoGPS(id: number, ubicacion: string): Promise<DispositivoGPS | undefined> {
    const res = await pool.query(
      'UPDATE dispositivo_gps SET ubicacion=$1 WHERE id=$2 RETURNING id, ubicacion',
      [ubicacion, id]
    );
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new DispositivoGPS(r.id, r.ubicacion);
  }

  async eliminarDispositivoGPS(id: number): Promise<boolean> {
    const res = await pool.query('DELETE FROM dispositivo_gps WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }

  async existe(id: number): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM dispositivo_gps WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }
}
