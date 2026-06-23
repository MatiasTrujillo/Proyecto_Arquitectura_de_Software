import pool from '../../Shared/Database/DatabaseConnection';
import { PreregistroProducto } from '../Dominio/PreregistroProducto';
import { IRepositorioPreregistroProducto } from '../IDataAccess/IRepositorioPreregistroProducto';

export class RepositorioPreregistroProducto implements IRepositorioPreregistroProducto {
  async crear(
    clienteEmpresaId: string,
    productoId: number,
    productoNombre: string,
    descripcion: string,
    valor: number | null,
    tamano: number | null,
    categoria: string | null,
  ): Promise<PreregistroProducto> {
    const res = await pool.query(
      `INSERT INTO preregistro_bien_empresa
         (cliente_empresa_id, producto_id, descripcion, valor, tamano, categoria)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (cliente_empresa_id, producto_id)
       DO UPDATE SET descripcion=$3, valor=$4, tamano=$5, categoria=$6
       RETURNING id, cliente_empresa_id, producto_id, descripcion, valor, tamano, categoria`,
      [clienteEmpresaId, productoId, descripcion, valor, tamano, categoria]
    );
    const r = res.rows[0];
    return new PreregistroProducto(r.id, r.cliente_empresa_id, r.producto_id, productoNombre, r.descripcion, r.valor, r.tamano, r.categoria);
  }

  async obtenerPorEmpresa(clienteEmpresaId: string): Promise<PreregistroProducto[]> {
    const res = await pool.query(
      `SELECT p.id, p.cliente_empresa_id, p.producto_id, pr.nombre AS producto_nombre,
              p.descripcion, p.valor, p.tamano, p.categoria
       FROM preregistro_bien_empresa p
       JOIN producto pr ON pr.id = p.producto_id
       WHERE p.cliente_empresa_id = $1
       ORDER BY p.id ASC`,
      [clienteEmpresaId]
    );
    return res.rows.map((r: any) => new PreregistroProducto(
      r.id, r.cliente_empresa_id, r.producto_id, r.producto_nombre,
      r.descripcion, r.valor, r.tamano, r.categoria
    ));
  }

  async obtenerPorEmpresaYProducto(clienteEmpresaId: string, productoId: number): Promise<PreregistroProducto | undefined> {
    const res = await pool.query(
      `SELECT p.id, p.cliente_empresa_id, p.producto_id, pr.nombre AS producto_nombre,
              p.descripcion, p.valor, p.tamano, p.categoria
       FROM preregistro_bien_empresa p
       JOIN producto pr ON pr.id = p.producto_id
       WHERE p.cliente_empresa_id = $1 AND p.producto_id = $2`,
      [clienteEmpresaId, productoId]
    );
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new PreregistroProducto(r.id, r.cliente_empresa_id, r.producto_id, r.producto_nombre, r.descripcion, r.valor, r.tamano, r.categoria);
  }

  async eliminar(id: number, clienteEmpresaId: string): Promise<boolean> {
    const res = await pool.query(
      'DELETE FROM preregistro_bien_empresa WHERE id=$1 AND cliente_empresa_id=$2',
      [id, clienteEmpresaId]
    );
    return res.rowCount! > 0;
  }

  async existe(id: number, clienteEmpresaId: string): Promise<boolean> {
    const res = await pool.query(
      'SELECT 1 FROM preregistro_bien_empresa WHERE id=$1 AND cliente_empresa_id=$2',
      [id, clienteEmpresaId]
    );
    return res.rowCount! > 0;
  }
}
