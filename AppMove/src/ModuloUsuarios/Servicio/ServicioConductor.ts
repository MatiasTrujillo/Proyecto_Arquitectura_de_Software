import { ConductorDTO } from "../DTOs/ConductorDTO";
import { IRepositorioConductor } from "../IDataAccess/IRepositorioConductor";
import { IServicioConductor } from "../IServicio/IServicioConductor";

export class ServicioConductor implements IServicioConductor {
  constructor(private repositorio: IRepositorioConductor) {}

  crearConductor(cedula: string, nombre: string): ConductorDTO {
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    const conductor = this.repositorio.crearConductor(cedula, nombre);
    return ConductorDTO.fromEntity(conductor);
  }

  obtenerConductores(): ConductorDTO[] {
    const conductores = this.repositorio.obtenerConductores();
    return conductores.map(c => ConductorDTO.fromEntity(c));
  }

  obtenerConductorPorId(id: string): ConductorDTO {
    this.validarId(id);
    const conductor = this.repositorio.obtenerConductorPorId(id);
    if (!conductor) {
      throw new Error(`No se encontró el conductor con id ${id}`);
    }
    return ConductorDTO.fromEntity(conductor);
  }

  actualizarConductor(id: string, cedula: string, nombre: string): ConductorDTO {
    this.validarId(id);
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    if (!this.repositorio.existe(id)) {
      throw new Error(`No se encontró el conductor con id ${id}`);
    }

    const conductorActualizado = this.repositorio.actualizarConductor(id, cedula, nombre);
    if (!conductorActualizado) {
      throw new Error(`No se pudo actualizar el conductor con id ${id}`);
    }

    return ConductorDTO.fromEntity(conductorActualizado);
  }

  eliminarConductor(id: string): void {
    this.validarId(id);

    if (!this.repositorio.eliminarConductor(id)) {
      throw new Error(`No se encontró el conductor con id ${id}`);
    }
  }

  private validarId(id: string): void {
    if (!id || typeof id !== "string" || id.trim() === "") {
      throw new Error("Id de conductor inválido");
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
