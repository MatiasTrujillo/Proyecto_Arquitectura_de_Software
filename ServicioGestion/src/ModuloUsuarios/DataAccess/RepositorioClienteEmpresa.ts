import pool from '../../Shared/Database/DatabaseConnection';
import { ClienteEmpresa } from "../Dominio/ClienteEmpresa";
import { IRepositorioClienteEmpresa } from "../IDataAccess/IRepositorioClienteEmpresa";

export class RepositorioClienteEmpresa implements IRepositorioClienteEmpresa {
  async crearClienteEmpresa(cedula: string, nombre: string): Promise<ClienteEmpresa> {
    const res = await pool.query(
      'INSERT INTO cliente_empresa (cedula, nombre) VALUES ($1, $2) RETURNING id, cedula, nombre',
      [cedula, nombre]
    );
    const r = res.rows[0];
    return new ClienteEmpresa(String(r.id), r.cedula, r.nombre);
  }

  async obtenerClienteEmpresas(): Promise<ClienteEmpresa[]> {
    const res = await pool.query('SELECT id, cedula, nombre FROM cliente_empresa');
    return res.rows.map((r: any) => new ClienteEmpresa(String(r.id), r.cedula, r.nombre));
  }

  async obtenerClienteEmpresaPorId(id: string): Promise<ClienteEmpresa | undefined> {
    const res = await pool.query('SELECT id, cedula, nombre FROM cliente_empresa WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new ClienteEmpresa(String(r.id), r.cedula, r.nombre);
  }

  async actualizarClienteEmpresa(id: string, cedula: string, nombre: string): Promise<ClienteEmpresa | undefined> {
    const res = await pool.query(
      'UPDATE cliente_empresa SET cedula = $1, nombre = $2 WHERE id = $3 RETURNING id, cedula, nombre',
      [cedula, nombre, id]
    );
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new ClienteEmpresa(String(r.id), r.cedula, r.nombre);
  }

  async eliminarClienteEmpresa(id: string): Promise<boolean> {
    const res = await pool.query('DELETE FROM cliente_empresa WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }

  async existe(id: string): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM cliente_empresa WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }

  async agregarOrigenFrecuente(cedula: string, origen: string): Promise<void> {
    await pool.query(
      `UPDATE cliente_empresa
       SET origenes_frecuentes = array_append(origenes_frecuentes, $2)
       WHERE cedula = $1 AND NOT ($2 = ANY(origenes_frecuentes))`,
      [cedula, origen]
    );
  }

  async agregarDestinoFrecuente(cedula: string, destino: string): Promise<void> {
    await pool.query(
      `UPDATE cliente_empresa
       SET destinos_frecuentes = array_append(destinos_frecuentes, $2)
       WHERE cedula = $1 AND NOT ($2 = ANY(destinos_frecuentes))`,
      [cedula, destino]
    );
  }

  async obtenerFrecuentes(cedula: string): Promise<{ origenes: string[]; destinos: string[] }> {
    const res = await pool.query(
      'SELECT origenes_frecuentes, destinos_frecuentes FROM cliente_empresa WHERE cedula = $1',
      [cedula]
    );
    if (!res.rows[0]) return { origenes: [], destinos: [] };
    return {
      origenes: res.rows[0].origenes_frecuentes ?? [],
      destinos: res.rows[0].destinos_frecuentes ?? [],
    };
  }
}
