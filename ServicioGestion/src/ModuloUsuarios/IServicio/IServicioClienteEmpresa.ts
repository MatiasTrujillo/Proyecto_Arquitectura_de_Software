import { ClienteEmpresaDTO } from "../DTOs/ClienteEmpresaDTO";

export interface IServicioClienteEmpresa {
  crearClienteEmpresa(cedula: string, nombre: string): Promise<ClienteEmpresaDTO>;
  obtenerClienteEmpresas(): Promise<ClienteEmpresaDTO[]>;
  obtenerClienteEmpresaPorId(id: string): Promise<ClienteEmpresaDTO>;
  actualizarClienteEmpresa(id: string, cedula: string, nombre: string): Promise<ClienteEmpresaDTO>;
  eliminarClienteEmpresa(id: string): Promise<void>;
}
