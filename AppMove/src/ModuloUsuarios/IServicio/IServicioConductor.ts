import { ConductorDTO } from "../DTOs/ConductorDTO";

export interface IServicioConductor {
  crearConductor(cedula: string, nombre: string): ConductorDTO;
  obtenerConductores(): ConductorDTO[];
  obtenerConductorPorId(id: string): ConductorDTO;
  actualizarConductor(id: string, cedula: string, nombre: string): ConductorDTO;
  eliminarConductor(id: string): void;
}
