import { ConductorDTO } from "../DTOs/ConductorDTO";

export interface IServicioConductor {
  crearConductor(cedula: string, nombre: string): Promise<ConductorDTO>;
  obtenerConductores(): Promise<ConductorDTO[]>;
  obtenerConductorPorId(id: string): Promise<ConductorDTO>;
  actualizarConductor(id: string, cedula: string, nombre: string): Promise<ConductorDTO>;
  eliminarConductor(id: string): Promise<void>;
}
