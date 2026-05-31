import { AdministradorDTO } from "../DTOs/AdministradorDTO";
import { IRepositorioAdministrador } from "../IDataAccess/IRepositorioAdministrador";
import { IServicioAdministrador } from "../IServicio/IServicioAdministrador";

export class ServicioAdministrador implements IServicioAdministrador {
  constructor(private repositorio: IRepositorioAdministrador) {}

  crearAdministrador(cedula: string, nombre: string): AdministradorDTO {
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    const administrador = this.repositorio.crearAdministrador(cedula, nombre);
    return AdministradorDTO.fromEntity(administrador);
  }

  obtenerAdministradores(): AdministradorDTO[] {
    const administradores = this.repositorio.obtenerAdministradores();
    return administradores.map(admin => AdministradorDTO.fromEntity(admin));
  }

  obtenerAdministradorPorId(id: string): AdministradorDTO {
    this.validarId(id);
    const administrador = this.repositorio.obtenerAdministradorPorId(id);

    if (!administrador) {
      throw new Error(`No se encontró el administrador con id ${id}`);
    }

    return AdministradorDTO.fromEntity(administrador);
  }

  actualizarAdministrador(id: string, cedula: string, nombre: string): AdministradorDTO {
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

    return AdministradorDTO.fromEntity(administradorActualizado);
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
