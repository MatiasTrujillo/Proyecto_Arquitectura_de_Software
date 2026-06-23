import pool from '../../Shared/Database/DatabaseConnection';

export interface ProductoReservaData {
  productoId: number | null;
  descripcion: string;
  valor: number | null;
  tamano: number | null;
  categorias: string[];
}

export interface ProductoReserva extends ProductoReservaData {
  id: number;
  reservaId: number;
  productoNombre: string | null;
}

export class RepositorioProductoReserva {
  async guardarProductos(reservaId: number, productos: ProductoReservaData[]): Promise<void> {
    for (const p of productos) {
      await pool.query(
        `INSERT INTO bien_reserva (reserva_id, producto_id, descripcion, valor, tamano, categorias)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [reservaId, p.productoId ?? null, p.descripcion, p.valor ?? null, p.tamano ?? null, p.categorias ?? []]
      );
    }
  }

  async obtenerPorReserva(reservaId: number): Promise<ProductoReserva[]> {
    const res = await pool.query(
      `SELECT br.id, br.reserva_id, br.producto_id, p.nombre AS producto_nombre,
              br.descripcion, br.valor, br.tamano, br.categorias
       FROM bien_reserva br
       LEFT JOIN producto p ON p.id = br.producto_id
       WHERE br.reserva_id = $1
       ORDER BY br.id ASC`,
      [reservaId]
    );
    return res.rows.map((r: any) => ({
      id: r.id,
      reservaId: r.reserva_id,
      productoId: r.producto_id,
      productoNombre: r.producto_nombre,
      descripcion: r.descripcion,
      valor: r.valor,
      tamano: r.tamano,
      categorias: r.categorias,
    }));
  }

  async actualizarCategorias(reservaId: number, categorias: string[]): Promise<void> {
    await pool.query(
      `UPDATE bien_reserva SET categorias = $1 WHERE reserva_id = $2`,
      [categorias, reservaId]
    );
  }
}
