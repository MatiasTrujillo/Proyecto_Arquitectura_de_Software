import pool from "../../Shared/Database/DatabaseConnection";
import { Categoria } from "../Dominio/Categoria";

export class RepositorioCategoria {
  private map(r: any): Categoria {
    return new Categoria(r.id, r.nombre, r.nombre_es, r.descripcion ?? '');
  }

  async obtenerTodas(): Promise<Categoria[]> {
    const res = await pool.query('SELECT id, nombre, nombre_es, descripcion FROM categoria ORDER BY nombre_es');
    return res.rows.map((r: any) => this.map(r));
  }

  async obtenerPorId(id: number): Promise<Categoria | undefined> {
    const res = await pool.query('SELECT id, nombre, nombre_es, descripcion FROM categoria WHERE id = $1', [id]);
    return res.rows[0] ? this.map(res.rows[0]) : undefined;
  }

  async crear(nombre: string, nombreEs: string, descripcion: string): Promise<Categoria> {
    const res = await pool.query(
      'INSERT INTO categoria (nombre, nombre_es, descripcion) VALUES ($1, $2, $3) RETURNING id, nombre, nombre_es, descripcion',
      [nombre, nombreEs, descripcion]
    );
    return this.map(res.rows[0]);
  }
}
