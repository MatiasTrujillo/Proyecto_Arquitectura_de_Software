import { Conductor } from "../Dominio/Conductor";

export interface IServicioConductor {
  crearConductor(cedula: string, nombre: string): Conductor;
  obtenerConductores(): Conductor[];
  obtenerConductorPorId(id: string): Conductor;
  actualizarConductor(id: string, cedula: string, nombre: string): Conductor;
  eliminarConductor(id: string): void;
}
