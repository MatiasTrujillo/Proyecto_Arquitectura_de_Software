import pool from '../../Shared/Database/DatabaseConnection';
import { Pago } from "../Domain/Pago";
import { EstadoPago } from "../Domain/EstadoPago";
import { IRepositorioPago } from "../IDataAccess/IRepositorioPago";

export class RepositorioPago implements IRepositorioPago {
  async crearPago(fecha: Date, monto: number, estado: EstadoPago): Promise<Pago> {
    const res = await pool.query(
      'INSERT INTO pago (fecha, monto, estado) VALUES ($1, $2, $3) RETURNING id, fecha, monto, estado',
      [fecha.toISOString(), monto, estado]
    );
    const r = res.rows[0];
    return new Pago(r.id, new Date(r.fecha), r.monto, r.estado as EstadoPago);
  }

  async obtenerPagos(): Promise<Pago[]> {
    const res = await pool.query('SELECT id, fecha, monto, estado FROM pago');
    return res.rows.map((r: any) => new Pago(r.id, new Date(r.fecha), r.monto, r.estado as EstadoPago));
  }

  async obtenerPagoPorId(id: number): Promise<Pago | undefined> {
    const res = await pool.query('SELECT id, fecha, monto, estado FROM pago WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new Pago(r.id, new Date(r.fecha), r.monto, r.estado as EstadoPago);
  }

  async actualizarPago(id: number, fecha: Date, monto: number, estado: EstadoPago): Promise<Pago | undefined> {
    const res = await pool.query(
      'UPDATE pago SET fecha=$1, monto=$2, estado=$3 WHERE id=$4 RETURNING id, fecha, monto, estado',
      [fecha.toISOString(), monto, estado, id]
    );
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new Pago(r.id, new Date(r.fecha), r.monto, r.estado as EstadoPago);
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