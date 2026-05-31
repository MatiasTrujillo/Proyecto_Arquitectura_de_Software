import { AdministradorDTO } from "../DTOs/AdministradorDTO";

export interface IServicioAdministrador {
  crearAdministrador(cedula: string, nombre: string): AdministradorDTO;
  obtenerAdministradores(): AdministradorDTO[];
  obtenerAdministradorPorId(id: string): AdministradorDTO;
  actualizarAdministrador(id: string, cedula: string, nombre: string): AdministradorDTO;
  eliminarAdministrador(id: string): void;
}
