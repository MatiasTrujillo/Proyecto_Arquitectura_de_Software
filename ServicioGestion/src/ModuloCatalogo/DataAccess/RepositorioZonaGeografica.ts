import pool from '../../Shared/Database/DatabaseConnection';
import { ZonaGeografica } from "../Dominio/ZonaGeografica";
import { IRepositorioZonaGeografica } from "../IDataAccess/IRepositorioZonaGeografica";

export class RepositorioZonaGeografica implements IRepositorioZonaGeografica {
  private mapRow(r: any): ZonaGeografica {
    return new ZonaGeografica(String(r.id), r.nombre, r.delimitacion_geografica, r.tipo);
  }

  async crearZona(nombre: string, delimitacionGeografica: string, tipo: string): Promise<ZonaGeografica> {
    const res = await pool.query(
      `INSERT INTO zona_geografica (nombre, delimitacion_geografica, tipo) VALUES ($1, $2, $3)
       RETURNING id, nombre, delimitacion_geografica, tipo`,
      [nombre, delimitacionGeografica, tipo]
    );
    return this.mapRow(res.rows[0]);
  }

  async obtenerZonas(): Promise<ZonaGeografica[]> {
    const res = await pool.query('SELECT id, nombre, delimitacion_geografica, tipo FROM zona_geografica');
    return res.rows.map((r: any) => this.mapRow(r));
  }

  async obtenerZonaPorId(id: string): Promise<ZonaGeografica | undefined> {
    const res = await pool.query('SELECT id, nombre, delimitacion_geografica, tipo FROM zona_geografica WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    return this.mapRow(res.rows[0]);
  }

  async actualizarZona(id: string, nombre: string, delimitacionGeografica: string, tipo: string): Promise<ZonaGeografica | undefined> {
    const res = await pool.query(
      `UPDATE zona_geografica SET nombre=$1, delimitacion_geografica=$2, tipo=$3 WHERE id=$4
       RETURNING id, nombre, delimitacion_geografica, tipo`,
      [nombre, delimitacionGeografica, tipo, id]
    );
    if (!res.rows[0]) return undefined;
    return this.mapRow(res.rows[0]);
  }

  async eliminarZona(id: string): Promise<boolean> {
    const res = await pool.query('DELETE FROM zona_geografica WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }

  async existe(id: string): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM zona_geografica WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }
}
