import pool from '../../Shared/Database/DatabaseConnection';
import { Incidente } from "../Dominio/Incidente";
import { IRepositorioIncidente } from "../IDataAccess/IRepositorioIncidente";

export class RepositorioIncidente implements IRepositorioIncidente {
  async crearIncidente(
    descripcion: string,
    fecha: Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ): Promise<Incidente> {
    const res = await pool.query(
      'INSERT INTO incidente (descripcion, fecha, reserva_id, estado, severidad) VALUES ($1, $2, $3, $4, $5) RETURNING id, descripcion, fecha, reserva_id, estado, severidad',
      [descripcion, fecha.toISOString(), reservaId, estado, severidad]
    );
    const r = res.rows[0];
    return new Incidente(String(r.id), r.descripcion, new Date(r.fecha), r.reserva_id, r.estado, r.severidad);
  }

  async obtenerIncidentes(): Promise<Incidente[]> {
    const res = await pool.query('SELECT id, descripcion, fecha, reserva_id, estado, severidad FROM incidente');
    return res.rows.map((r: any) => new Incidente(String(r.id), r.descripcion, new Date(r.fecha), r.reserva_id, r.estado, r.severidad));
  }

  async obtenerIncidentePorId(id: string): Promise<Incidente | undefined> {
    const res = await pool.query('SELECT id, descripcion, fecha, reserva_id, estado, severidad FROM incidente WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new Incidente(String(r.id), r.descripcion, new Date(r.fecha), r.reserva_id, r.estado, r.severidad);
  }

  async actualizarIncidente(
    id: string,
    descripcion: string,
    fecha: Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ): Promise<Incidente | undefined> {
    const res = await pool.query(
      'UPDATE incidente SET descripcion=$1, fecha=$2, reserva_id=$3, estado=$4, severidad=$5 WHERE id=$6 RETURNING id, descripcion, fecha, reserva_id, estado, severidad',
      [descripcion, fecha.toISOString(), reservaId, estado, severidad, id]
    );
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new Incidente(String(r.id), r.descripcion, new Date(r.fecha), r.reserva_id, r.estado, r.severidad);
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
