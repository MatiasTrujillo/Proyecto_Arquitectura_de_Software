import pool from "../../Shared/Database/DatabaseConnection";
import { ReglaCategoria } from "../Dominio/ReglaCategoria";
import { ReglaDTO } from "../DTOs/ReglaDTO";

export class RepositorioReglaCategoria {
  async obtenerTodas(): Promise<ReglaDTO[]> {
    const res = await pool.query(
      `SELECT rc.id, rc.categoria_id, c.nombre, c.nombre_es,
              rc.requiere_monitoreo, rc.genera_alertas, rc.recargo_porcentaje
       FROM regla_categoria rc
       JOIN categoria c ON c.id = rc.categoria_id
       ORDER BY c.nombre_es`
    );
    return res.rows.map((r: any) => new ReglaDTO(
      r.id, r.categoria_id, r.nombre, r.nombre_es,
      r.requiere_monitoreo, r.genera_alertas, Number(r.recargo_porcentaje)
    ));
  }

  async obtenerPorId(id: number): Promise<ReglaDTO | undefined> {
    const res = await pool.query(
      `SELECT rc.id, rc.categoria_id, c.nombre, c.nombre_es,
              rc.requiere_monitoreo, rc.genera_alertas, rc.recargo_porcentaje
       FROM regla_categoria rc
       JOIN categoria c ON c.id = rc.categoria_id
       WHERE rc.id = $1`,
      [id]
    );
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new ReglaDTO(r.id, r.categoria_id, r.nombre, r.nombre_es,
      r.requiere_monitoreo, r.genera_alertas, Number(r.recargo_porcentaje));
  }

  async obtenerPorCategoria(categoriaId: number): Promise<ReglaDTO | undefined> {
    const res = await pool.query(
      `SELECT rc.id, rc.categoria_id, c.nombre, c.nombre_es,
              rc.requiere_monitoreo, rc.genera_alertas, rc.recargo_porcentaje
       FROM regla_categoria rc
       JOIN categoria c ON c.id = rc.categoria_id
       WHERE rc.categoria_id = $1`,
      [categoriaId]
    );
    if (!res.rows[0]) return undefined;
    const r = res.rows[0];
    return new ReglaDTO(r.id, r.categoria_id, r.nombre, r.nombre_es,
      r.requiere_monitoreo, r.genera_alertas, Number(r.recargo_porcentaje));
  }

  async contarReglas(): Promise<number> {
    const res = await pool.query('SELECT COUNT(*) FROM regla_categoria');
    return Number(res.rows[0].count);
  }

  async crear(categoriaId: number, requiereMonitoreo: boolean, generaAlertas: boolean, recargoPorcentaje: number): Promise<ReglaDTO> {
    const res = await pool.query(
      `INSERT INTO regla_categoria (categoria_id, requiere_monitoreo, genera_alertas, recargo_porcentaje)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [categoriaId, requiereMonitoreo, generaAlertas, recargoPorcentaje]
    );
    return (await this.obtenerPorId(res.rows[0].id))!;
  }

  async actualizar(id: number, requiereMonitoreo: boolean, generaAlertas: boolean, recargoPorcentaje: number): Promise<ReglaDTO | undefined> {
    await pool.query(
      `UPDATE regla_categoria SET requiere_monitoreo=$1, genera_alertas=$2, recargo_porcentaje=$3 WHERE id=$4`,
      [requiereMonitoreo, generaAlertas, recargoPorcentaje, id]
    );
    return this.obtenerPorId(id);
  }

  async eliminar(id: number): Promise<boolean> {
    const res = await pool.query('DELETE FROM regla_categoria WHERE id=$1', [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async fueUsadaEnReserva(categoriaId: number): Promise<boolean> {
    const cat = await pool.query('SELECT nombre, nombre_es FROM categoria WHERE id=$1', [categoriaId]);
    if (!cat.rows[0]) return false;
    const { nombre, nombre_es } = cat.rows[0];
    const res = await pool.query(
      `SELECT 1 FROM reserva WHERE $1 = ANY(categorias) OR $2 = ANY(categorias) LIMIT 1`,
      [nombre, nombre_es]
    );
    return (res.rowCount ?? 0) > 0;
  }
}
