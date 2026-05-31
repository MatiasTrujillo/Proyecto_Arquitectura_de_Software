import { OperadorDTO } from "../DTOs/OperadorDTO";

export interface IServicioOperador {
  crearOperador(cedula: string, nombre: string): Promise<OperadorDTO>;
  obtenerOperadores(): Promise<OperadorDTO[]>;
  obtenerOperadorPorId(id: string): Promise<OperadorDTO>;
  actualizarOperador(id: string, cedula: string, nombre: string): Promise<OperadorDTO>;
  eliminarOperador(id: string): Promise<void>;
}
