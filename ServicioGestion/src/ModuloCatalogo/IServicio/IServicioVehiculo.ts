import { VehiculoDTO } from "../DTOs/VehiculoDTO";

export interface IServicioVehiculo {
  crearVehiculo(matricula: string, tipo: string, capacidad: number, dispositivoGPS: string, disponible: boolean, caracteristicas: Record<string, string>): Promise<VehiculoDTO>;
  obtenerVehiculos(): Promise<VehiculoDTO[]>;
  obtenerVehiculoPorId(id: string): Promise<VehiculoDTO>;
  actualizarVehiculo(id: string, matricula: string, tipo: string, capacidad: number, dispositivoGPS: string, disponible: boolean, caracteristicas: Record<string, string>): Promise<VehiculoDTO>;
  eliminarVehiculo(id: string): Promise<void>;
}
