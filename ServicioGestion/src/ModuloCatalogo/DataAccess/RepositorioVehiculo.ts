import pool from '../../Shared/Database/DatabaseConnection';
import { Vehiculo } from "../Dominio/Vehiculo";
import { IRepositorioVehiculo } from "../IDataAccess/IRepositorioVehiculo";

export class RepositorioVehiculo implements IRepositorioVehiculo {
  private mapRow(r: any): Vehiculo {
    return new Vehiculo(
      String(r.id),
      r.matricula,
      r.tipo,
      Number(r.capacidad),
      r.dispositivo_gps ?? '',
      Boolean(r.disponible),
      r.caracteristicas ?? {}
    );
  }

  async crearVehiculo(matricula: string, tipo: string, capacidad: number, dispositivoGPS: string, disponible: boolean, caracteristicas: Record<string, string>): Promise<Vehiculo> {
    const res = await pool.query(
      `INSERT INTO vehiculo (matricula, tipo, capacidad, dispositivo_gps, disponible, caracteristicas)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, matricula, tipo, capacidad, dispositivo_gps, disponible, caracteristicas`,
      [matricula, tipo, capacidad, dispositivoGPS, disponible, JSON.stringify(caracteristicas)]
    );
    return this.mapRow(res.rows[0]);
  }

  async obtenerVehiculos(): Promise<Vehiculo[]> {
    const res = await pool.query('SELECT id, matricula, tipo, capacidad, dispositivo_gps, disponible, caracteristicas FROM vehiculo');
    return res.rows.map((r: any) => this.mapRow(r));
  }

  async obtenerVehiculoPorId(id: string): Promise<Vehiculo | undefined> {
    const res = await pool.query('SELECT id, matricula, tipo, capacidad, dispositivo_gps, disponible, caracteristicas FROM vehiculo WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    return this.mapRow(res.rows[0]);
  }

  async actualizarVehiculo(id: string, matricula: string, tipo: string, capacidad: number, dispositivoGPS: string, disponible: boolean, caracteristicas: Record<string, string>): Promise<Vehiculo | undefined> {
    const res = await pool.query(
      `UPDATE vehiculo SET matricula=$1, tipo=$2, capacidad=$3, dispositivo_gps=$4, disponible=$5, caracteristicas=$6
       WHERE id=$7
       RETURNING id, matricula, tipo, capacidad, dispositivo_gps, disponible, caracteristicas`,
      [matricula, tipo, capacidad, dispositivoGPS, disponible, JSON.stringify(caracteristicas), id]
    );
    if (!res.rows[0]) return undefined;
    return this.mapRow(res.rows[0]);
  }

  async eliminarVehiculo(id: string): Promise<boolean> {
    const res = await pool.query('DELETE FROM vehiculo WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }

  async existe(id: string): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM vehiculo WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }
}
