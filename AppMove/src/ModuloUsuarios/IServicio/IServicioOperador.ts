import { OperadorDTO } from "../DTOs/OperadorDTO";

export interface IServicioOperador {
  crearOperador(cedula: string, nombre: string): OperadorDTO;
  obtenerOperadores(): OperadorDTO[];
  obtenerOperadorPorId(id: string): OperadorDTO;
  actualizarOperador(id: string, cedula: string, nombre: string): OperadorDTO;
  eliminarOperador(id: string): void;
}
