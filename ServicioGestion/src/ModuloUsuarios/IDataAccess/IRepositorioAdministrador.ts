import { Administrador } from "../Dominio/Administrador";

export interface IRepositorioAdministrador {
  crearAdministrador(cedula: string, nombre: string): Administrador;
  obtenerAdministradores(): Administrador[];
  obtenerAdministradorPorId(id: string): Administrador | undefined;
  actualizarAdministrador(id: string, cedula: string, nombre: string): Administrador | undefined;
  eliminarAdministrador(id: string): boolean;
  existe(id: string): boolean;
}
