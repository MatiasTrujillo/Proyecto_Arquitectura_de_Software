import { ClientePersonal } from "../Dominio/ClientePersonal";

export interface IRepositorioClientePersonal {
  crearClientePersonal(cedula: string, nombre: string): ClientePersonal;
  obtenerClientePersonales(): ClientePersonal[];
  obtenerClientePersonalPorId(id: string): ClientePersonal | undefined;
  actualizarClientePersonal(id: string, cedula: string, nombre: string): ClientePersonal | undefined;
  eliminarClientePersonal(id: string): boolean;
  existe(id: string): boolean;
}
