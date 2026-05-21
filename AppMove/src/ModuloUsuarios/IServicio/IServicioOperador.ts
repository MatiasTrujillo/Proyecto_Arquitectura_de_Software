import { Operador } from "../Dominio/Operador";

export interface IServicioOperador {
  crearOperador(cedula: string, nombre: string): Operador;
  obtenerOperadores(): Operador[];
  obtenerOperadorPorId(id: string): Operador;
  actualizarOperador(id: string, cedula: string, nombre: string): Operador;
  eliminarOperador(id: string): void;
}
