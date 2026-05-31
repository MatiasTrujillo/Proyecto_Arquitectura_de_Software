import pool from '../../Shared/Database/DatabaseConnection';
import { Viaje } from "../Dominio/Viaje";
import { IRepositorioViaje } from "../IDataAccess/IRepositorioViaje";

export class RepositorioViaje implements IRepositorioViaje {
  async crearViaje(
    reservaId: string,
    origen: string,
    destino: string,
    fecha: Date,
    estado: string,
    conductor: string,
  ): Promise<Viaje> {
    const res = await pool.query(
      'INSERT INTO viaje (reserva_id, origen, destino, fecha, estado, conductor) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, reserva_id, origen, destino, fecha, estado, conductor',
      [reservaId, origen, destino, fecha.toISOString(), estado, conductor]
    );
    const r = res.rows[0];
    return new Viaje(String(r.id), r.reserva_id, r.origen, r.destino, new Date(r.fecha), r.estado, r.conductor);
  }

  async obtenerViajes(): Promise<Viaje[]> {
    const res = await pool.query('SELECT id, reserva_id, origen, destino, fecha, estado, conductor FROM viaje');
    return res.rows.map((r: any) => new Viaje(String(r.id), r.reserva_id, r.origen, r.destino, new Date(r.fecha), r.estado, r.conductor));
  }

  async obtenerViajePorId(id: string): Promise<Viaje | undefined> {
    const res = await pool.query('SELECT id, reserva_id, origen, destino, fecha, estado, conductor FROM viaje WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new Viaje(String(r.id), r.reserva_id, r.origen, r.destino, new Date(r.fecha), r.estado, r.conductor);
  }

  async actualizarViaje(
    id: string,
    reservaId: string,
    origen: string,
    destino: string,
    fecha: Date,
    estado: string,
    conductor: string,
  ): Promise<Viaje | undefined> {
    const res = await pool.query(
      'UPDATE viaje SET reserva_id=$1, origen=$2, destino=$3, fecha=$4, estado=$5, conductor=$6 WHERE id=$7 RETURNING id, reserva_id, origen, destino, fecha, estado, conductor',
      [reservaId, origen, destino, fecha.toISOString(), estado, conductor, id]
    );
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new Viaje(String(r.id), r.reserva_id, r.origen, r.destino, new Date(r.fecha), r.estado, r.conductor);
  }

  async eliminarViaje(id: string): Promise<boolean> {
    const res = await pool.query('DELETE FROM viaje WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }

  async existe(id: string): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM viaje WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }
}
