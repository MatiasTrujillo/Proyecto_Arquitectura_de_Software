import { ClientePersonal } from "../Dominio/ClientePersonal";

export interface IServicioClientePersonal {
  crearClientePersonal(cedula: string, nombre: string): ClientePersonal;
  obtenerClientePersonales(): ClientePersonal[];
  obtenerClientePersonalPorId(id: string): ClientePersonal;
  actualizarClientePersonal(id: string, cedula: string, nombre: string): ClientePersonal;
  eliminarClientePersonal(id: string): void;
}
