import { ClienteEmpresaDTO } from "../DTOs/ClienteEmpresaDTO";

export interface IServicioClienteEmpresa {
  crearClienteEmpresa(cedula: string, nombre: string): ClienteEmpresaDTO;
  obtenerClienteEmpresas(): ClienteEmpresaDTO[];
  obtenerClienteEmpresaPorId(id: string): ClienteEmpresaDTO;
  actualizarClienteEmpresa(id: string, cedula: string, nombre: string): ClienteEmpresaDTO;
  eliminarClienteEmpresa(id: string): void;
}
