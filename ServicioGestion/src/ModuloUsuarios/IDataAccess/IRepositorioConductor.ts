import { Conductor } from "../Dominio/Conductor";

export interface IRepositorioConductor {
  crearConductor(cedula: string, nombre: string): Promise<Conductor>;
  obtenerConductores(): Promise<Conductor[]>;
  obtenerConductorPorId(id: string): Promise<Conductor | undefined>;
  actualizarConductor(id: string, cedula: string, nombre: string): Promise<Conductor | undefined>;
  eliminarConductor(id: string): Promise<boolean>;
  existe(id: string): Promise<boolean>;
}
