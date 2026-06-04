
import { Vehiculo } from "../Domain/Vehiculo";
import { IRepositorioVehiculo } from "../IDataAccess/IRepositorioVehiculo";

export class RepositorioVehiculo implements IRepositorioVehiculo {
	private vehiculos: Vehiculo[] = [];
	private proximoId: number = 1;

	async crearVehiculo(matricula: string, tipo: string, capacidad: number, dispositivoGps: string): Promise<Vehiculo> {
		const v = new Vehiculo(this.proximoId++, matricula, tipo, capacidad, dispositivoGps);
		this.vehiculos.push(v);
		return v;
	}

	async obtenerVehiculos(): Promise<Vehiculo[]> {
		return this.vehiculos;
	}

	async obtenerVehiculoPorId(id: number): Promise<Vehiculo | undefined> {
		return this.vehiculos.find(v => v.getId() === id);
	}

	async actualizarVehiculo(id: number, matricula: string, tipo: string, capacidad: number, dispositivoGps: string): Promise<Vehiculo | undefined> {
		let actualizado: Vehiculo | undefined;
		this.vehiculos = this.vehiculos.map(v => {
			if (v.getId() !== id) return v;
			actualizado = new Vehiculo(id, matricula, tipo, capacidad, dispositivoGps);
			return actualizado;
		});
		return actualizado;
	}

	async eliminarVehiculo(id: number): Promise<boolean> {
		const original = this.vehiculos.length;
		this.vehiculos = this.vehiculos.filter(v => v.getId() !== id);
		return this.vehiculos.length !== original;
	}

	async existe(id: number): Promise<boolean> {
		return this.vehiculos.some(v => v.getId() === id);
	}
}
