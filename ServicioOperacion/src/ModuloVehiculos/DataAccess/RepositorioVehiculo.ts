import pool from '../../Shared/Database/DatabaseConnection';
import { Vehiculo } from "../Domain/Vehiculo";
import { IRepositorioVehiculo } from "../IDataAccess/IRepositorioVehiculo";

export class RepositorioVehiculo implements IRepositorioVehiculo {
  private mapRow(r: any): Vehiculo {
    return new Vehiculo(r.id, r.matricula, r.tipo, r.capacidad, r.dispositivo_gps, r.caracteristicas ?? []);
  }

  async crearVehiculo(matricula: string, tipo: string, capacidad: number, dispositivoGps: string, caracteristicas: string[]): Promise<Vehiculo> {
    const res = await pool.query(
      'INSERT INTO vehiculo (matricula, tipo, capacidad, dispositivo_gps, caracteristicas) VALUES ($1, $2, $3, $4, $5) RETURNING id, matricula, tipo, capacidad, dispositivo_gps, caracteristicas',
      [matricula, tipo, capacidad, dispositivoGps, caracteristicas]
    );
    return this.mapRow(res.rows[0]);
  }

  async obtenerVehiculos(): Promise<Vehiculo[]> {
    const res = await pool.query('SELECT id, matricula, tipo, capacidad, dispositivo_gps, caracteristicas FROM vehiculo');
    return res.rows.map((r: any) => this.mapRow(r));
  }

  async obtenerVehiculoPorId(id: number): Promise<Vehiculo | undefined> {
    const res = await pool.query('SELECT id, matricula, tipo, capacidad, dispositivo_gps, caracteristicas FROM vehiculo WHERE id = $1', [id]);
    if (!res.rows[0]) return undefined;
    return this.mapRow(res.rows[0]);
  }

  async actualizarVehiculo(id: number, matricula: string, tipo: string, capacidad: number, dispositivoGps: string, caracteristicas: string[]): Promise<Vehiculo | undefined> {
    const res = await pool.query(
      'UPDATE vehiculo SET matricula=$1, tipo=$2, capacidad=$3, dispositivo_gps=$4, caracteristicas=$5 WHERE id=$6 RETURNING id, matricula, tipo, capacidad, dispositivo_gps, caracteristicas',
      [matricula, tipo, capacidad, dispositivoGps, caracteristicas, id]
    );
    if (!res.rows[0]) return undefined;
    return this.mapRow(res.rows[0]);
  }

  async eliminarVehiculo(id: number): Promise<boolean> {
    const res = await pool.query('DELETE FROM vehiculo WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }

  async existe(id: number): Promise<boolean> {
    const res = await pool.query('SELECT 1 FROM vehiculo WHERE id = $1', [id]);
    return res.rowCount! > 0;
  }

  async obtenerPorMatricula(matricula: string): Promise<Vehiculo | undefined> {
    const res = await pool.query(
      'SELECT id, matricula, tipo, capacidad, dispositivo_gps, caracteristicas FROM vehiculo WHERE matricula = $1',
      [matricula]
    );
    if (!res.rows[0]) return undefined;
    return this.mapRow(res.rows[0]);
  }

  async obtenerPorDispositivoGps(dispositivoGpsId: string): Promise<Vehiculo | undefined> {
    const res = await pool.query(
      'SELECT id, matricula, tipo, capacidad, dispositivo_gps, caracteristicas FROM vehiculo WHERE dispositivo_gps = $1',
      [dispositivoGpsId]
    );
    if (!res.rows[0]) return undefined;
    return this.mapRow(res.rows[0]);
  }
}
