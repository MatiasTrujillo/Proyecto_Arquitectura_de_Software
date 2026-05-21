import { Administrador } from "../Dominio/Administrador";
import { IRepositorioAdministrador } from "../IDataAccess/IRepositorioAdministrador";
import { IServicioAdministrador } from "../IServicio/IServicioAdministrador";

export class ServicioAdministrador implements IServicioAdministrador {
  constructor(private repositorio: IRepositorioAdministrador) {}

  crearAdministrador(cedula: string, nombre: string): Administrador {
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    return this.repositorio.crearAdministrador(cedula, nombre);
  }

  obtenerAdministradores(): Administrador[] {
    return this.repositorio.obtenerAdministradores();
  }

  obtenerAdministradorPorId(id: string): Administrador {
    this.validarId(id);
    const administrador = this.repositorio.obtenerAdministradorPorId(id);

    if (!administrador) {
      throw new Error(`No se encontró el administrador con id ${id}`);
    }

    return administrador;
  }

  actualizarAdministrador(id: string, cedula: string, nombre: string): Administrador {
    this.validarId(id);
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    if (!this.repositorio.existe(id)) {
      throw new Error(`No se encontró el administrador con id ${id}`);
    }

    const administradorActualizado = this.repositorio.actualizarAdministrador(id, cedula, nombre);
    if (!administradorActualizado) {
      throw new Error(`No se pudo actualizar el administrador con id ${id}`);
    }

    return administradorActualizado;
  }

  eliminarAdministrador(id: string): void {
    this.validarId(id);

    if (!this.repositorio.eliminarAdministrador(id)) {
      throw new Error(`No se encontró el administrador con id ${id}`);
    }
  }

  private validarId(id: string): void {
    if (!id || typeof id !== "string" || id.trim() === "") {
      throw new Error("Id de administrador inválido");
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
