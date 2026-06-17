import { Vehiculo } from "../Dominio/Vehiculo";

export interface IRepositorioVehiculo {
  crearVehiculo(matricula: string, tipo: string, capacidad: number, dispositivoGPS: string, disponible: boolean, caracteristicas: Record<string, string>): Promise<Vehiculo>;
  obtenerVehiculos(): Promise<Vehiculo[]>;
  obtenerVehiculoPorId(id: string): Promise<Vehiculo | undefined>;
  actualizarVehiculo(id: string, matricula: string, tipo: string, capacidad: number, dispositivoGPS: string, disponible: boolean, caracteristicas: Record<string, string>): Promise<Vehiculo | undefined>;
  eliminarVehiculo(id: string): Promise<boolean>;
  existe(id: string): Promise<boolean>;
}
