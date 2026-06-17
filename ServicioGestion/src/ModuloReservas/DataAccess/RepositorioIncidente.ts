import pool from '../../Shared/Database/DatabaseConnection';
import { Incidente } from "../Dominio/Incidente";
import { IRepositorioIncidente } from "../IDataAccess/IRepositorioIncidente";

export class RepositorioIncidente implements IRepositorioIncidente {
  private mapRow(r: any): Incidente {
    return new Incidente(String(r.id), r.descripcion, new Date(r.fecha), r.reserva_id, r.estado, r.severidad, r.conductor_id ?? '');
  }

  async crearIncidente(descripcion: string, fecha: Date, reservaId: string, estado: string, severidad: string, conductorId: string): Promise<Incidente> {
    const res = await pool.query(
      'INSERT INTO incidente (descripcion, fecha, reserva_id, estado, severidad, conductor_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, descripcion, fecha, reserva_id, estado, severidad, conductor_id',
      [descripcion, fecha.toISOString(), reservaId, estado, severidad, conductorId]
    );
    return this.mapRow(res.rows[0]);
  }

  async obtenerIncidentes(): Promise<Incidente[]> {
    const res = await pool.query('SELECT id, descripcion, fecha, reserva_id, estado, severidad, conductor_id FROM incidente');
    return res.rows.map((r: any) => this.mapRow(r));
  }

  async obtenerIncidentePorId(id: string): Promise<Incidente | undefined> {
    const res = await pool.query('SELECT id, descripcion, fecha, reserva_id, estado, severidad, conductor_id FROM incidente WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    return this.mapRow(res.rows[0]);
  }

  async actualizarIncidente(id: string, descripcion: string, fecha: Date, reservaId: string, estado: string, severidad: string, conductorId: string): Promise<Incidente | undefined> {
    const res = await pool.query(
      'UPDATE incidente SET descripcion=$1, fecha=$2, reserva_id=$3, estado=$4, severidad=$5, conductor_id=$6 WHERE id=$7 RETURNING id, descripcion, fecha, reserva_id, estado, severidad, conductor_id',
      [descripcion, fecha.toISOString(), reservaId, estado, severidad, conductorId, id]
    );
    if (!res.rows[0]) return undefined;
    return this.mapRow(res.rows[0]);
  }

  async eliminarIncidente(id: string): Promise<boolean> {
    const res = await pool.query('DELETE FROM incidente WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }

  async existe(id: string): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM incidente WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }
}
