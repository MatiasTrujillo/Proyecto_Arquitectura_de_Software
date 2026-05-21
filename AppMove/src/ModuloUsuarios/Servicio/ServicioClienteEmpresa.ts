import { ClienteEmpresa } from "../Dominio/ClienteEmpresa";
import { IRepositorioClienteEmpresa } from "../IDataAccess/IRepositorioClienteEmpresa";
import { IServicioClienteEmpresa } from "../IServicio/IServicioClienteEmpresa";

export class ServicioClienteEmpresa implements IServicioClienteEmpresa {
  constructor(private repositorio: IRepositorioClienteEmpresa) {}

  crearClienteEmpresa(cedula: string, nombre: string): ClienteEmpresa {
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    return this.repositorio.crearClienteEmpresa(cedula, nombre);
  }

  obtenerClienteEmpresas(): ClienteEmpresa[] {
    return this.repositorio.obtenerClienteEmpresas();
  }

  obtenerClienteEmpresaPorId(id: string): ClienteEmpresa {
    this.validarId(id);
    const cliente = this.repositorio.obtenerClienteEmpresaPorId(id);
    if (!cliente) {
      throw new Error(`No se encontró el cliente empresa con id ${id}`);
    }
    return cliente;
  }

  actualizarClienteEmpresa(id: string, cedula: string, nombre: string): ClienteEmpresa {
    this.validarId(id);
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    if (!this.repositorio.existe(id)) {
      throw new Error(`No se encontró el cliente empresa con id ${id}`);
    }

    const clienteActualizado = this.repositorio.actualizarClienteEmpresa(id, cedula, nombre);
    if (!clienteActualizado) {
      throw new Error(`No se pudo actualizar el cliente empresa con id ${id}`);
    }

    return clienteActualizado;
  }

  eliminarClienteEmpresa(id: string): void {
    this.validarId(id);

    if (!this.repositorio.eliminarClienteEmpresa(id)) {
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
