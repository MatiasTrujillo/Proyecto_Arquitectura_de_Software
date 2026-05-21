import { Administrador } from "../Dominio/Administrador";

export interface IServicioAdministrador {
  crearAdministrador(cedula: string, nombre: string): Administrador;
  obtenerAdministradores(): Administrador[];
  obtenerAdministradorPorId(id: string): Administrador;
  actualizarAdministrador(id: string, cedula: string, nombre: string): Administrador;
  eliminarAdministrador(id: string): void;
}
