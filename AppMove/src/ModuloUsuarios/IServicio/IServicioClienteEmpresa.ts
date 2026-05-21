import { ClienteEmpresa } from "../Dominio/ClienteEmpresa";

export interface IServicioClienteEmpresa {
  crearClienteEmpresa(cedula: string, nombre: string): ClienteEmpresa;
  obtenerClienteEmpresas(): ClienteEmpresa[];
  obtenerClienteEmpresaPorId(id: string): ClienteEmpresa;
  actualizarClienteEmpresa(id: string, cedula: string, nombre: string): ClienteEmpresa;
  eliminarClienteEmpresa(id: string): void;
}
