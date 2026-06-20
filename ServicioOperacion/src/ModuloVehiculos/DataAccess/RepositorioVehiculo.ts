import pool from '../../Shared/Database/DatabaseConnection';
import { Vehiculo } from "../Domain/Vehiculo";
import { IRepositorioVehiculo } from "../IDataAccess/IRepositorioVehiculo";

export class RepositorioVehiculo implements IRepositorioVehiculo {
	async crearVehiculo(matricula: string, tipo: string, capacidad: number, dispositivoGps: string): Promise<Vehiculo> {
		const res = await pool.query(
			'INSERT INTO vehiculo (matricula, tipo, capacidad, dispositivo_gps) VALUES ($1, $2, $3, $4) RETURNING id, matricula, tipo, capacidad, dispositivo_gps',
			[matricula, tipo, capacidad, dispositivoGps]
		);
		const r = res.rows[0];
		return new Vehiculo(r.id, r.matricula, r.tipo, r.capacidad, r.dispositivo_gps);
	}

	async obtenerVehiculos(): Promise<Vehiculo[]> {
		const res = await pool.query('SELECT id, matricula, tipo, capacidad, dispositivo_gps FROM vehiculo');
		return res.rows.map((r: any) => new Vehiculo(r.id, r.matricula, r.tipo, r.capacidad, r.dispositivo_gps));
	}

	async obtenerVehiculoPorId(id: number): Promise<Vehiculo | undefined> {
		const res = await pool.query('SELECT id, matricula, tipo, capacidad, dispositivo_gps FROM vehiculo WHERE id = $1', [id]);
		if (!res.rows[0]) return undefined;
		const r = res.rows[0];
		return new Vehiculo(r.id, r.matricula, r.tipo, r.capacidad, r.dispositivo_gps);
	}

	async actualizarVehiculo(id: number, matricula: string, tipo: string, capacidad: number, dispositivoGps: string): Promise<Vehiculo | undefined> {
		const res = await pool.query(
			'UPDATE vehiculo SET matricula=$1, tipo=$2, capacidad=$3, dispositivo_gps=$4 WHERE id=$5 RETURNING id, matricula, tipo, capacidad, dispositivo_gps',
			[matricula, tipo, capacidad, dispositivoGps, id]
		);
		if (!res.rows[0]) return undefined;
		const r = res.rows[0];
		return new Vehiculo(r.id, r.matricula, r.tipo, r.capacidad, r.dispositivo_gps);
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
			'SELECT id, matricula, tipo, capacidad, dispositivo_gps FROM vehiculo WHERE matricula = $1',
			[matricula]
		);
		if (!res.rows[0]) return undefined;
		const r = res.rows[0];
		return new Vehiculo(r.id, r.matricula, r.tipo, r.capacidad, r.dispositivo_gps);
	}
}
