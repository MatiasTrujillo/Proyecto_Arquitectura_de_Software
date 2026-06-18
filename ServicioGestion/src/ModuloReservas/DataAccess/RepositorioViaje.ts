import pool from '../../Shared/Database/DatabaseConnection';
import { Viaje } from "../Dominio/Viaje";
import { IRepositorioViaje, FiltrosViajeEnCurso } from "../IDataAccess/IRepositorioViaje";

export class RepositorioViaje implements IRepositorioViaje {
  private readonly COLS = 'id, reserva_id, origen, destino, fecha, estado, conductor, vehiculo, tiene_alertas';

  private mapRow(r: any): Viaje {
    return new Viaje(String(r.id), r.reserva_id, r.origen, r.destino, new Date(r.fecha), r.estado, r.conductor ?? '', r.vehiculo ?? '', r.tiene_alertas ?? false);
  }

  async crearViaje(reservaId: string, origen: string, destino: string, fecha: Date, estado: string, conductor: string, vehiculo: string): Promise<Viaje> {
    const res = await pool.query(
      `INSERT INTO viaje (reserva_id, origen, destino, fecha, estado, conductor, vehiculo) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING ${this.COLS}`,
      [reservaId, origen, destino, fecha.toISOString(), estado, conductor, vehiculo]
    );
    return this.mapRow(res.rows[0]);
  }

  async obtenerViajes(): Promise<Viaje[]> {
    const res = await pool.query(`SELECT ${this.COLS} FROM viaje ORDER BY fecha DESC`);
    return res.rows.map((r: any) => this.mapRow(r));
  }

  async obtenerViajePorId(id: string): Promise<Viaje | undefined> {
    const res = await pool.query(`SELECT ${this.COLS} FROM viaje WHERE id = $1`, [id]);
    return res.rows[0] ? this.mapRow(res.rows[0]) : undefined;
  }

  async obtenerViajePorReservaId(reservaId: string): Promise<Viaje | undefined> {
    const res = await pool.query(`SELECT ${this.COLS} FROM viaje WHERE reserva_id = $1`, [reservaId]);
    return res.rows[0] ? this.mapRow(res.rows[0]) : undefined;
  }

  async obtenerViajesPorConductor(conductorId: string): Promise<Viaje[]> {
    const res = await pool.query(
      `SELECT ${this.COLS} FROM viaje WHERE conductor = $1 AND estado != 'Finalizado' ORDER BY fecha ASC`,
      [conductorId]
    );
    return res.rows.map((r: any) => this.mapRow(r));
  }

  async obtenerViajesEnCurso(filtros?: FiltrosViajeEnCurso): Promise<Viaje[]> {
    const condiciones: string[] = ["estado != 'Finalizado'"];
    const valores: any[] = [];

    if (filtros?.vehiculo) {
      valores.push(filtros.vehiculo);
      condiciones.push(`vehiculo = $${valores.length}`);
    }
    if (filtros?.conductor) {
      valores.push(filtros.conductor);
      condiciones.push(`conductor = $${valores.length}`);
    }
    if (filtros?.tieneAlertas !== undefined) {
      valores.push(filtros.tieneAlertas);
      condiciones.push(`tiene_alertas = $${valores.length}`);
    }

    const res = await pool.query(`SELECT ${this.COLS} FROM viaje WHERE ${condiciones.join(' AND ')} ORDER BY fecha DESC`, valores);
    return res.rows.map((r: any) => this.mapRow(r));
  }

  async actualizarViaje(id: string, reservaId: string, origen: string, destino: string, fecha: Date, estado: string, conductor: string, vehiculo: string): Promise<Viaje | undefined> {
    const res = await pool.query(
      `UPDATE viaje SET reserva_id=$1, origen=$2, destino=$3, fecha=$4, estado=$5, conductor=$6, vehiculo=$7 WHERE id=$8 RETURNING ${this.COLS}`,
      [reservaId, origen, destino, fecha.toISOString(), estado, conductor, vehiculo, id]
    );
    return res.rows[0] ? this.mapRow(res.rows[0]) : undefined;
  }

  async actualizarEstadoViaje(id: string, estado: string): Promise<Viaje | undefined> {
    const res = await pool.query(
      `UPDATE viaje SET estado=$1 WHERE id=$2 RETURNING ${this.COLS}`,
      [estado, id]
    );
    return res.rows[0] ? this.mapRow(res.rows[0]) : undefined;
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
