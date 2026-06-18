import pool from '../../Shared/Database/DatabaseConnection';
import { Reserva } from "../Dominio/Reserva";
import { IRepositorioReserva } from "../IDataAccess/IRepositorioReserva";

export class RepositorioReserva implements IRepositorioReserva {
  private mapRow(r: any): Reserva {
    return new Reserva(
      String(r.id),
      String(r.cliente),
      r.origen,
      r.destino,
      new Date(r.fecha),
      r.estado,
      Number(r.costo),
      r.vehiculo,
      r.productos ?? [],
      r.conductor,
      r.categorias ?? []
    );
  }

  async crearReserva(
    cliente: string,
    origen: string,
    destino: string,
    fecha: Date,
    estado: string,
    costo: number,
    vehiculo: string | null,
    productos: string[],
    conductor: string | null,
    categorias: string[]
  ): Promise<Reserva> {
    const res = await pool.query(
      `INSERT INTO reserva (cliente, origen, destino, fecha, estado, costo, vehiculo, productos, conductor, categorias)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, cliente, origen, destino, fecha, estado, costo, vehiculo, productos, conductor, categorias`,
      [cliente, origen, destino, fecha.toISOString(), estado, costo, vehiculo, productos, conductor, categorias]
    );
    return this.mapRow(res.rows[0]);
  }

  async obtenerReservas(): Promise<Reserva[]> {
    const res = await pool.query(
      'SELECT id, cliente, origen, destino, fecha, estado, costo, vehiculo, productos, conductor, categorias FROM reserva'
    );
    return res.rows.map((r: any) => this.mapRow(r));
  }

  async obtenerReservaPorId(id: string): Promise<Reserva | undefined> {
    const res = await pool.query(
      'SELECT id, cliente, origen, destino, fecha, estado, costo, vehiculo, productos, conductor, categorias FROM reserva WHERE id = $1',
      [id]
    );
    if (!res.rows[0]) return undefined;
    return this.mapRow(res.rows[0]);
  }

  async obtenerReservasPorCliente(clienteId: string): Promise<Reserva[]> {
    const res = await pool.query(
      'SELECT id, cliente, origen, destino, fecha, estado, costo, vehiculo, productos, conductor, categorias FROM reserva WHERE cliente = $1',
      [clienteId]
    );
    return res.rows.map((r: any) => this.mapRow(r));
  }

  async actualizarEstadoReserva(id: string, estado: string): Promise<Reserva | undefined> {
    const res = await pool.query(
      `UPDATE reserva SET estado = $1 WHERE id = $2
       RETURNING id, cliente, origen, destino, fecha, estado, costo, vehiculo, productos, conductor, categorias`,
      [estado, id]
    );
    if (!res.rows[0]) return undefined;
    return this.mapRow(res.rows[0]);
  }

  async asignarVehiculoConductor(id: string, vehiculo: string, conductor: string): Promise<Reserva | undefined> {
    const res = await pool.query(
      `UPDATE reserva SET vehiculo = $1, conductor = $2 WHERE id = $3
       RETURNING id, cliente, origen, destino, fecha, estado, costo, vehiculo, productos, conductor, categorias`,
      [vehiculo, conductor, id]
    );
    return res.rows[0] ? this.mapRow(res.rows[0]) : undefined;
  }

  async obtenerReservasSinViaje(): Promise<Reserva[]> {
    const res = await pool.query(
      `SELECT r.id, r.cliente, r.origen, r.destino, r.fecha, r.estado, r.costo,
              r.vehiculo, r.productos, r.conductor, r.categorias
       FROM reserva r
       WHERE NOT EXISTS (SELECT 1 FROM viaje v WHERE v.reserva_id = r.id::text)
       ORDER BY r.fecha ASC`
    );
    return res.rows.map((r: any) => this.mapRow(r));
  }

  async existe(id: string): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM reserva WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }
}
