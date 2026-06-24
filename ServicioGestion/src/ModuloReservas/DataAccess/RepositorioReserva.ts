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

  async obtenerReservasPorCliente(clienteId: string, fechaDesde?: string, fechaHasta?: string, estado?: string): Promise<Reserva[]> {
    const conds: string[] = ['cliente = $1'];
    const vals: any[] = [clienteId];
    if (fechaDesde) { vals.push(fechaDesde); conds.push(`fecha >= $${vals.length}`); }
    if (fechaHasta) { vals.push(fechaHasta + 'T23:59:59'); conds.push(`fecha <= $${vals.length}`); }
    if (estado)     { vals.push(estado);     conds.push(`estado = $${vals.length}`); }
    const res = await pool.query(
      `SELECT id, cliente, origen, destino, fecha, estado, costo, vehiculo, productos, conductor, categorias FROM reserva WHERE ${conds.join(' AND ')} ORDER BY fecha DESC`,
      vals
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

  // ACID: actualiza la reserva y crea el viaje en una sola transacción.
  // Si cualquier paso falla, se hace ROLLBACK y ningún cambio persiste.
  async asignarYCrearViajeAtomico(reservaId: string, vehiculo: string, conductor: string): Promise<Reserva | undefined> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const resReserva = await client.query(
        `UPDATE reserva SET vehiculo = $1, conductor = $2 WHERE id = $3
         RETURNING id, cliente, origen, destino, fecha, estado, costo, vehiculo, productos, conductor, categorias`,
        [vehiculo, conductor, reservaId]
      );

      if (!resReserva.rows[0]) {
        await client.query('ROLLBACK');
        return undefined;
      }
      const r = resReserva.rows[0];

      await client.query(
        `INSERT INTO viaje (reserva_id, origen, destino, fecha, estado, conductor, vehiculo)
         SELECT $1::text, $2, $3, $4, 'Pendiente', $5, $6
         WHERE NOT EXISTS (SELECT 1 FROM viaje WHERE reserva_id = $1::text)`,
        [reservaId, r.origen, r.destino, r.fecha, conductor, vehiculo]
      );

      await client.query('COMMIT');
      return this.mapRow(r);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
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

  async actualizarCosto(id: string, costo: number): Promise<void> {
    await pool.query('UPDATE reserva SET costo = $1 WHERE id = $2', [costo, id]);
  }

  async existe(id: string): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM reserva WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }

  async vehiculoEnViajeActivo(vehiculo: string): Promise<boolean> {
    const res = await pool.query(
      `SELECT 1 FROM reserva r
       LEFT JOIN viaje v ON v.reserva_id = r.id::text
       WHERE r.vehiculo = $1
         AND r.estado != 'Cancelado'
         AND (v.id IS NULL OR v.estado NOT IN ('Finalizado', 'Cancelado'))
       LIMIT 1`,
      [vehiculo]
    );
    return res.rowCount! > 0;
  }

  async obtenerVehiculosOcupados(): Promise<string[]> {
    const res = await pool.query(
      `SELECT DISTINCT r.vehiculo FROM reserva r
       LEFT JOIN viaje v ON v.reserva_id = r.id::text
       WHERE r.vehiculo IS NOT NULL AND r.vehiculo != ''
         AND r.estado != 'Cancelado'
         AND (v.id IS NULL OR v.estado NOT IN ('Finalizado', 'Cancelado'))`
    );
    return res.rows.map((r: any) => r.vehiculo);
  }

  async obtenerTamanoTotalProductos(reservaId: string): Promise<number> {
    const res = await pool.query(
      `SELECT COALESCE(SUM(p.tamano), 0) AS total
       FROM reserva r
       JOIN producto p ON p.id = ANY(r.productos::int[])
       WHERE r.id = $1`,
      [reservaId]
    );
    return Number(res.rows[0]?.total ?? 0);
  }
}
