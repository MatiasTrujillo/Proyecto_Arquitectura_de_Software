import { ClientePersonalDTO } from "../DTOs/ClientePersonalDTO";
import { IRepositorioClientePersonal } from "../IDataAccess/IRepositorioClientePersonal";
import { IServicioClientePersonal } from "../IServicio/IServicioClientePersonal";

export class ServicioClientePersonal implements IServicioClientePersonal {
  constructor(private repositorio: IRepositorioClientePersonal) {}

  async crearClientePersonal(cedula: string, nombre: string, email?: string): Promise<ClientePersonalDTO> {
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    const cliente = await this.repositorio.crearClientePersonal(cedula, nombre, email);
    return ClientePersonalDTO.fromEntity(cliente);
  }

  async obtenerClientePersonales(): Promise<ClientePersonalDTO[]> {
    const clientes = await this.repositorio.obtenerClientePersonales();
    return clientes.map(c => ClientePersonalDTO.fromEntity(c));
  }

  async obtenerClientePersonalPorId(id: string): Promise<ClientePersonalDTO> {
    this.validarId(id);
    const cliente = await this.repositorio.obtenerClientePersonalPorId(id);
    if (!cliente) {
      throw new Error(`No se encontró el cliente personal con id ${id}`);
    }
    return ClientePersonalDTO.fromEntity(cliente);
  }

  async actualizarClientePersonal(id: string, cedula: string, nombre: string): Promise<ClientePersonalDTO> {
    this.validarId(id);
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    if (!await this.repositorio.existe(id)) {
      throw new Error(`No se encontró el cliente personal con id ${id}`);
    }

    const clienteActualizado = await this.repositorio.actualizarClientePersonal(id, cedula, nombre);
    if (!clienteActualizado) {
      throw new Error(`No se pudo actualizar el cliente personal con id ${id}`);
    }

    return ClientePersonalDTO.fromEntity(clienteActualizado);
  }

  async eliminarClientePersonal(id: string): Promise<void> {
    this.validarId(id);

    if (!await this.repositorio.eliminarClientePersonal(id)) {
      throw new Error(`No se encontró el cliente personal con id ${id}`);
    }
  }

  private validarId(id: string): void {
    if (!id || typeof id !== "string" || id.trim() === "") {
      throw new Error("Id de cliente personal inválido");
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
