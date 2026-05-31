import { OperadorDTO } from "../DTOs/OperadorDTO";
import { IRepositorioOperador } from "../IDataAccess/IRepositorioOperador";
import { IServicioOperador } from "../IServicio/IServicioOperador";

export class ServicioOperador implements IServicioOperador {
  constructor(private repositorio: IRepositorioOperador) {}

  async crearOperador(cedula: string, nombre: string): Promise<OperadorDTO> {
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    const operador = await this.repositorio.crearOperador(cedula, nombre);
    return OperadorDTO.fromEntity(operador);
  }

  async obtenerOperadores(): Promise<OperadorDTO[]> {
    const operadores = await this.repositorio.obtenerOperadores();
    return operadores.map(op => OperadorDTO.fromEntity(op));
  }

  async obtenerOperadorPorId(id: string): Promise<OperadorDTO> {
    this.validarId(id);
    const operador = await this.repositorio.obtenerOperadorPorId(id);
    if (!operador) {
      throw new Error(`No se encontró el operador con id ${id}`);
    }
    return OperadorDTO.fromEntity(operador);
  }

  async actualizarOperador(id: string, cedula: string, nombre: string): Promise<OperadorDTO> {
    this.validarId(id);
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    if (!await this.repositorio.existe(id)) {
      throw new Error(`No se encontró el operador con id ${id}`);
    }

    const operadorActualizado = await this.repositorio.actualizarOperador(id, cedula, nombre);
    if (!operadorActualizado) {
      throw new Error(`No se pudo actualizar el operador con id ${id}`);
    }
    return OperadorDTO.fromEntity(operadorActualizado);
  }

  async eliminarOperador(id: string): Promise<void> {
    this.validarId(id);
    if (!await this.repositorio.eliminarOperador(id)) {
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
