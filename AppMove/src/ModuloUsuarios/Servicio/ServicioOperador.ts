import { OperadorDTO } from "../DTOs/OperadorDTO";
import { IRepositorioOperador } from "../IDataAccess/IRepositorioOperador";
import { IServicioOperador } from "../IServicio/IServicioOperador";

export class ServicioOperador implements IServicioOperador {
  constructor(private repositorio: IRepositorioOperador) {}

  crearOperador(cedula: string, nombre: string): OperadorDTO {
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    const operador = this.repositorio.crearOperador(cedula, nombre);
    return OperadorDTO.fromEntity(operador);
  }

  obtenerOperadores(): OperadorDTO[] {
    const operadores = this.repositorio.obtenerOperadores();
    return operadores.map(op => OperadorDTO.fromEntity(op));
  }

  obtenerOperadorPorId(id: string): OperadorDTO {
    this.validarId(id);
    const operador = this.repositorio.obtenerOperadorPorId(id);
    if (!operador) {
      throw new Error(`No se encontró el operador con id ${id}`);
    }
    return OperadorDTO.fromEntity(operador);
  }

  actualizarOperador(id: string, cedula: string, nombre: string): OperadorDTO {
    this.validarId(id);
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    if (!this.repositorio.existe(id)) {
      throw new Error(`No se encontró el operador con id ${id}`);
    }

    const operadorActualizado = this.repositorio.actualizarOperador(id, cedula, nombre);
    if (!operadorActualizado) {
      throw new Error(`No se pudo actualizar el operador con id ${id}`);
    }
    return OperadorDTO.fromEntity(operadorActualizado);
  }

  eliminarOperador(id: string): void {
    this.validarId(id);
    if (!this.repositorio.eliminarOperador(id)) {
      throw new Error(`No se encontró el operador con id ${id}`);
    }
  }

  private validarId(id: string): void {
    if (!id || typeof id !== "string" || id.trim() === "") {
      throw new Error("Id de operador inválido");
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
