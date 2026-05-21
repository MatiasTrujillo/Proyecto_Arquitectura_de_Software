import { Conductor } from "../Dominio/Conductor";

export interface IRepositorioConductor {
  crearConductor(cedula: string, nombre: string): Conductor;
  obtenerConductores(): Conductor[];
  obtenerConductorPorId(id: string): Conductor | undefined;
  actualizarConductor(id: string, cedula: string, nombre: string): Conductor | undefined;
  eliminarConductor(id: string): boolean;
  existe(id: string): boolean;
}
