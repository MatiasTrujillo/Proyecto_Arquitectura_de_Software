import pool from '../../Shared/Database/DatabaseConnection';
import { Pago } from "../Domain/Pago";
import { EstadoPago } from "../Domain/EstadoPago";
import { IRepositorioPago } from "../IDataAccess/IRepositorioPago";

export class RepositorioPago implements IRepositorioPago {
  private mapRow(r: any): Pago {
    return new Pago(r.id, new Date(r.fecha), r.monto, r.estado as EstadoPago, r.reserva_id ?? '');
  }

  async crearPago(fecha: Date, monto: number, estado: EstadoPago, reservaId: string): Promise<Pago> {
    const res = await pool.query(
      'INSERT INTO pago (fecha, monto, estado, reserva_id) VALUES ($1, $2, $3, $4) RETURNING id, fecha, monto, estado, reserva_id',
      [fecha.toISOString(), monto, estado, reservaId]
    );
    return this.mapRow(res.rows[0]);
  }

  async obtenerPagos(): Promise<Pago[]> {
    const res = await pool.query('SELECT id, fecha, monto, estado, reserva_id FROM pago');
    return res.rows.map((r: any) => this.mapRow(r));
  }

  async obtenerPagoPorId(id: number): Promise<Pago | undefined> {
    const res = await pool.query('SELECT id, fecha, monto, estado, reserva_id FROM pago WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    return this.mapRow(res.rows[0]);
  }

  async actualizarPago(id: number, fecha: Date, monto: number, estado: EstadoPago, reservaId: string): Promise<Pago | undefined> {
    const res = await pool.query(
      'UPDATE pago SET fecha=$1, monto=$2, estado=$3, reserva_id=$4 WHERE id=$5 RETURNING id, fecha, monto, estado, reserva_id',
      [fecha.toISOString(), monto, estado, reservaId, id]
    );
    if (!res.rows[0]) return undefined;
    return this.mapRow(res.rows[0]);
  }

  async eliminarPago(id: number): Promise<boolean> {
    const res = await pool.query('DELETE FROM pago WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }

  async existe(id: number): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM pago WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }
}
