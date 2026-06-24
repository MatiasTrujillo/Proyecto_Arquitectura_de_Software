import { VehiculoDTO } from "../DTOs/VehiculoDTO";

export interface IServicioVehiculo {
  crearVehiculo(matricula: string, tipo: string, capacidad: number, dispositivoGps: string, caracteristicas: string[]): Promise<VehiculoDTO>;
  obtenerVehiculos(): Promise<VehiculoDTO[]>;
  obtenerVehiculoPorId(id: number): Promise<VehiculoDTO>;
  actualizarVehiculo(id: number, matricula: string, tipo: string, capacidad: number, dispositivoGps: string, caracteristicas: string[]): Promise<VehiculoDTO>;
  eliminarVehiculo(id: number): Promise<void>;
  obtenerVehiculoPorMatricula(matricula: string): Promise<VehiculoDTO>;
}
