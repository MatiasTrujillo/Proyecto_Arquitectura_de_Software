import { ClientePersonalDTO } from "../DTOs/ClientePersonalDTO";

export interface IServicioClientePersonal {
  crearClientePersonal(cedula: string, nombre: string): ClientePersonalDTO;
  obtenerClientePersonales(): ClientePersonalDTO[];
  obtenerClientePersonalPorId(id: string): ClientePersonalDTO;
  actualizarClientePersonal(id: string, cedula: string, nombre: string): ClientePersonalDTO;
  eliminarClientePersonal(id: string): void;
}
