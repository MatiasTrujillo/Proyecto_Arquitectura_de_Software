import { ClienteEmpresa } from "../Dominio/ClienteEmpresa";

export interface IRepositorioClienteEmpresa {
  crearClienteEmpresa(cedula: string, nombre: string): ClienteEmpresa;
  obtenerClienteEmpresas(): ClienteEmpresa[];
  obtenerClienteEmpresaPorId(id: string): ClienteEmpresa | undefined;
  actualizarClienteEmpresa(id: string, cedula: string, nombre: string): ClienteEmpresa | undefined;
  eliminarClienteEmpresa(id: string): boolean;
  existe(id: string): boolean;
}
