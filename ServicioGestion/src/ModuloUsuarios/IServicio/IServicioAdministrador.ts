import { AdministradorDTO } from "../DTOs/AdministradorDTO";

export interface IServicioAdministrador {
  crearAdministrador(cedula: string, nombre: string): Promise<AdministradorDTO>;
  obtenerAdministradores(): Promise<AdministradorDTO[]>;
  obtenerAdministradorPorId(id: string): Promise<AdministradorDTO>;
  actualizarAdministrador(id: string, cedula: string, nombre: string): Promise<AdministradorDTO>;
  eliminarAdministrador(id: string): Promise<void>;
}
