import { ClientePersonalDTO } from "../DTOs/ClientePersonalDTO";

export interface IServicioClientePersonal {
  crearClientePersonal(cedula: string, nombre: string, email?: string): Promise<ClientePersonalDTO>;
  obtenerClientePersonales(): Promise<ClientePersonalDTO[]>;
  obtenerClientePersonalPorId(id: string): Promise<ClientePersonalDTO>;
  actualizarClientePersonal(id: string, cedula: string, nombre: string): Promise<ClientePersonalDTO>;
  eliminarClientePersonal(id: string): Promise<void>;
}
