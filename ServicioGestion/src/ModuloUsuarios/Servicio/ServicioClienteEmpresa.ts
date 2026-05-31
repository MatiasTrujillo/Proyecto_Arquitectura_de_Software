import { ClienteEmpresaDTO } from "../DTOs/ClienteEmpresaDTO";
import { IRepositorioClienteEmpresa } from "../IDataAccess/IRepositorioClienteEmpresa";
import { IServicioClienteEmpresa } from "../IServicio/IServicioClienteEmpresa";

export class ServicioClienteEmpresa implements IServicioClienteEmpresa {
  constructor(private repositorio: IRepositorioClienteEmpresa) {}

  async crearClienteEmpresa(cedula: string, nombre: string): Promise<ClienteEmpresaDTO> {
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    const cliente = await this.repositorio.crearClienteEmpresa(cedula, nombre);
    return ClienteEmpresaDTO.fromEntity(cliente);
  }

  async obtenerClienteEmpresas(): Promise<ClienteEmpresaDTO[]> {
    const clientes = await this.repositorio.obtenerClienteEmpresas();
    return clientes.map(c => ClienteEmpresaDTO.fromEntity(c));
  }

  async obtenerClienteEmpresaPorId(id: string): Promise<ClienteEmpresaDTO> {
    this.validarId(id);
    const cliente = await this.repositorio.obtenerClienteEmpresaPorId(id);
    if (!cliente) {
      throw new Error(`No se encontró el cliente empresa con id ${id}`);
    }
    return ClienteEmpresaDTO.fromEntity(cliente);
  }

  async actualizarClienteEmpresa(id: string, cedula: string, nombre: string): Promise<ClienteEmpresaDTO> {
    this.validarId(id);
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    if (!await this.repositorio.existe(id)) {
      throw new Error(`No se encontró el cliente empresa con id ${id}`);
    }

    const clienteActualizado = await this.repositorio.actualizarClienteEmpresa(id, cedula, nombre);
    if (!clienteActualizado) {
      throw new Error(`No se pudo actualizar el cliente empresa con id ${id}`);
    }

    return ClienteEmpresaDTO.fromEntity(clienteActualizado);
  }

  async eliminarClienteEmpresa(id: string): Promise<void> {
    this.validarId(id);

    if (!await this.repositorio.eliminarClienteEmpresa(id)) {
      throw new Error(`No se encontró el cliente empresa con id ${id}`);
    }
  }

  private validarId(id: string): void {
    if (!id || typeof id !== "string" || id.trim() === "") {
      throw new Error("Id de cliente empresa inválido");
    }
  }

  private validarCedula(cedula: string): void {
    if (!cedula || typeof cedula !== "string" || cedula.trim() === "") {
      throw new Error("Cédula inválida");
    }
  }

  private validarNombre(nombre: string): void {
    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
      throw new Error("Nombre inválido");
    }
  }
}
