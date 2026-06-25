import { Administrador } from "../Dominio/Administrador";

export interface IRepositorioAdministrador {
  crearAdministrador(cedula: string, nombre: string, email?: string): Promise<Administrador>;
  obtenerAdministradores(): Promise<Administrador[]>;
  obtenerAdministradorPorId(id: string): Promise<Administrador | undefined>;
  actualizarAdministrador(id: string, cedula: string, nombre: string): Promise<Administrador | undefined>;
  eliminarAdministrador(id: string): Promise<boolean>;
  existe(id: string): Promise<boolean>;
}
