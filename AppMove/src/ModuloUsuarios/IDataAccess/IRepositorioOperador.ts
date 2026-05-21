import { Operador } from "../Dominio/Operador";

export interface IRepositorioOperador {
  crearOperador(cedula: string, nombre: string): Operador;
  obtenerOperadores(): Operador[];
  obtenerOperadorPorId(id: string): Operador | undefined;
  actualizarOperador(id: string, cedula: string, nombre: string): Operador | undefined;
  eliminarOperador(id: string): boolean;
  existe(id: string): boolean;
}
