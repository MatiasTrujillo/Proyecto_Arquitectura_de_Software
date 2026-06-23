import pool from '../../Shared/Database/DatabaseConnection';
import { Producto } from "../Dominio/Producto";
import { IRepositorioProducto } from "../IDataAccess/IRepositorioProducto";

export class RepositorioProducto implements IRepositorioProducto {
  async crearProducto(nombre: string): Promise<Producto> {
    const res = await pool.query(
      'INSERT INTO producto (nombre) VALUES ($1) RETURNING id, nombre',
      [nombre]
    );
    const r = res.rows[0];
    return new Producto(r.id, r.nombre);
  }

  async obtenerProductos(): Promise<Producto[]> {
    const res = await pool.query('SELECT id, nombre FROM producto ORDER BY nombre ASC');
    return res.rows.map((r: any) => new Producto(r.id, r.nombre));
  }

  async obtenerProductoPorId(id: number): Promise<Producto | undefined> {
    const res = await pool.query('SELECT id, nombre FROM producto WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    return new Producto(res.rows[0].id, res.rows[0].nombre);
  }

  async actualizarProducto(id: number, nombre: string): Promise<Producto | undefined> {
    const res = await pool.query(
      'UPDATE producto SET nombre=$1 WHERE id=$2 RETURNING id, nombre',
      [nombre, id]
    );
    if (!res.rows[0]) return undefined;
    return new Producto(res.rows[0].id, res.rows[0].nombre);
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
