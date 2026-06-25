import { ClientePersonal } from "../Dominio/ClientePersonal";

export interface IRepositorioClientePersonal {
  crearClientePersonal(cedula: string, nombre: string, email?: string): Promise<ClientePersonal>;
  obtenerClientePersonales(): Promise<ClientePersonal[]>;
  obtenerClientePersonalPorId(id: string): Promise<ClientePersonal | undefined>;
  actualizarClientePersonal(id: string, cedula: string, nombre: string): Promise<ClientePersonal | undefined>;
  eliminarClientePersonal(id: string): Promise<boolean>;
  existe(id: string): Promise<boolean>;
}
