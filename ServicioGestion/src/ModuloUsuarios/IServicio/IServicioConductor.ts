import { ConductorDTO } from "../DTOs/ConductorDTO";

export interface IServicioConductor {
  crearConductor(cedula: string, nombre: string, email?: string): Promise<ConductorDTO>;
  obtenerConductores(): Promise<ConductorDTO[]>;
  obtenerConductoresDisponibles(): Promise<ConductorDTO[]>;
  obtenerConductorPorId(id: string): Promise<ConductorDTO>;
  actualizarConductor(id: string, cedula: string, nombre: string): Promise<ConductorDTO>;
  eliminarConductor(id: string): Promise<void>;
}
