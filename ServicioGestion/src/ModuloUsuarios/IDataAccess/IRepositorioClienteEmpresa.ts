import { ClienteEmpresa } from "../Dominio/ClienteEmpresa";

export interface IRepositorioClienteEmpresa {
  crearClienteEmpresa(cedula: string, nombre: string, email?: string): Promise<ClienteEmpresa>;
  obtenerClienteEmpresas(): Promise<ClienteEmpresa[]>;
  obtenerClienteEmpresaPorId(id: string): Promise<ClienteEmpresa | undefined>;
  actualizarClienteEmpresa(id: string, cedula: string, nombre: string): Promise<ClienteEmpresa | undefined>;
  eliminarClienteEmpresa(id: string): Promise<boolean>;
  existe(id: string): Promise<boolean>;
}
