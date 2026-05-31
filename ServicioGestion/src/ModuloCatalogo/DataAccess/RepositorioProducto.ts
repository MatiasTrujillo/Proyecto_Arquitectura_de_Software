import pool from '../../Shared/Database/DatabaseConnection';
import { Producto } from "../Dominio/Producto";
import { IRepositorioProducto } from "../IDataAccess/IRepositorioProducto";

export class RepositorioProducto implements IRepositorioProducto {
  async crearProducto(descripcion: string, valor: number, tamano: number, categoria: string): Promise<Producto> {
    const res = await pool.query(
      'INSERT INTO producto (descripcion, valor, tamano, categoria) VALUES ($1, $2, $3, $4) RETURNING id, descripcion, valor, tamano, categoria',
      [descripcion, valor, tamano, categoria]
    );
    const r = res.rows[0];
    return new Producto(r.id, r.descripcion, r.valor, r.tamano, r.categoria);
  }

  async obtenerProductos(): Promise<Producto[]> {
    const res = await pool.query('SELECT id, descripcion, valor, tamano, categoria FROM producto');
    return res.rows.map((r: any) => new Producto(r.id, r.descripcion, r.valor, r.tamano, r.categoria));
  }

  async obtenerProductoPorId(id: number): Promise<Producto | undefined> {
    const res = await pool.query('SELECT id, descripcion, valor, tamano, categoria FROM producto WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new Producto(r.id, r.descripcion, r.valor, r.tamano, r.categoria);
  }

  async actualizarProducto(id: number, descripcion: string, valor: number, tamano: number, categoria: string): Promise<Producto | undefined> {
    const res = await pool.query(
      'UPDATE producto SET descripcion=$1, valor=$2, tamano=$3, categoria=$4 WHERE id=$5 RETURNING id, descripcion, valor, tamano, categoria',
      [descripcion, valor, tamano, categoria, id]
    );
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new Producto(r.id, r.descripcion, r.valor, r.tamano, r.categoria);
  }

  async eliminarProducto(id: number): Promise<boolean> {
    const res = await pool.query('DELETE FROM producto WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }

  async existe(id: number): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM producto WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }
}
