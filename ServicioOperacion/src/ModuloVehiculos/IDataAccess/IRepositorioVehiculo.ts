import { Vehiculo } from "../Domain/Vehiculo";

export interface IRepositorioVehiculo {
  crearVehiculo(matricula: string, tipo: string, capacidad: number, dispositivoGps: string): Promise<Vehiculo>;
  obtenerVehiculos(): Promise<Vehiculo[]>;
  obtenerVehiculoPorId(id: number): Promise<Vehiculo | undefined>;
  actualizarVehiculo(id: number, matricula: string, tipo: string, capacidad: number, dispositivoGps: string): Promise<Vehiculo | undefined>;
  eliminarVehiculo(id: number): Promise<boolean>;
  existe(id: number): Promise<boolean>;
  obtenerPorMatricula(matricula: string): Promise<Vehiculo | undefined>;
}
