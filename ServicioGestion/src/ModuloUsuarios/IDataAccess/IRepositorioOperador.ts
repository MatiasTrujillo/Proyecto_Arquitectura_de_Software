import { Operador } from "../Dominio/Operador";

export interface IRepositorioOperador {
  crearOperador(cedula: string, nombre: string): Promise<Operador>;
  obtenerOperadores(): Promise<Operador[]>;
  obtenerOperadorPorId(id: string): Promise<Operador | undefined>;
  actualizarOperador(id: string, cedula: string, nombre: string): Promise<Operador | undefined>;
  eliminarOperador(id: string): Promise<boolean>;
  existe(id: string): Promise<boolean>;
}
