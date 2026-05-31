import { ClientePersonalDTO } from "../DTOs/ClientePersonalDTO";
import { IRepositorioClientePersonal } from "../IDataAccess/IRepositorioClientePersonal";
import { IServicioClientePersonal } from "../IServicio/IServicioClientePersonal";

export class ServicioClientePersonal implements IServicioClientePersonal {
  constructor(private repositorio: IRepositorioClientePersonal) {}

  crearClientePersonal(cedula: string, nombre: string): ClientePersonalDTO {
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    const cliente = this.repositorio.crearClientePersonal(cedula, nombre);
    return ClientePersonalDTO.fromEntity(cliente);
  }

  obtenerClientePersonales(): ClientePersonalDTO[] {
    const clientes = this.repositorio.obtenerClientePersonales();
    return clientes.map(c => ClientePersonalDTO.fromEntity(c));
  }

  obtenerClientePersonalPorId(id: string): ClientePersonalDTO {
    this.validarId(id);
    const cliente = this.repositorio.obtenerClientePersonalPorId(id);
    if (!cliente) {
      throw new Error(`No se encontró el cliente personal con id ${id}`);
    }
    return ClientePersonalDTO.fromEntity(cliente);
  }

  actualizarClientePersonal(id: string, cedula: string, nombre: string): ClientePersonalDTO {
    this.validarId(id);
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    if (!this.repositorio.existe(id)) {
      throw new Error(`No se encontró el cliente personal con id ${id}`);
    }

    const clienteActualizado = this.repositorio.actualizarClientePersonal(id, cedula, nombre);
    if (!clienteActualizado) {
      throw new Error(`No se pudo actualizar el cliente personal con id ${id}`);
    }

    return ClientePersonalDTO.fromEntity(clienteActualizado);
  }

  eliminarClientePersonal(id: string): void {
    this.validarId(id);

    if (!this.repositorio.eliminarClientePersonal(id)) {
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
