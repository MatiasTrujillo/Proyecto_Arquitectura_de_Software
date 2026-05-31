import { ConductorDTO } from "../DTOs/ConductorDTO";
import { IRepositorioConductor } from "../IDataAccess/IRepositorioConductor";
import { IServicioConductor } from "../IServicio/IServicioConductor";

export class ServicioConductor implements IServicioConductor {
  constructor(private repositorio: IRepositorioConductor) {}

  async crearConductor(cedula: string, nombre: string): Promise<ConductorDTO> {
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    const conductor = await this.repositorio.crearConductor(cedula, nombre);
    return ConductorDTO.fromEntity(conductor);
  }

  async obtenerConductores(): Promise<ConductorDTO[]> {
    const conductores = await this.repositorio.obtenerConductores();
    return conductores.map(c => ConductorDTO.fromEntity(c));
  }

  async obtenerConductorPorId(id: string): Promise<ConductorDTO> {
    this.validarId(id);
    const conductor = await this.repositorio.obtenerConductorPorId(id);
    if (!conductor) {
      throw new Error(`No se encontró el conductor con id ${id}`);
    }
    return ConductorDTO.fromEntity(conductor);
  }

  async actualizarConductor(id: string, cedula: string, nombre: string): Promise<ConductorDTO> {
    this.validarId(id);
    this.validarCedula(cedula);
    this.validarNombre(nombre);

    if (!await this.repositorio.existe(id)) {
      throw new Error(`No se encontró el conductor con id ${id}`);
    }

    const conductorActualizado = await this.repositorio.actualizarConductor(id, cedula, nombre);
    if (!conductorActualizado) {
      throw new Error(`No se pudo actualizar el conductor con id ${id}`);
    }

    return ConductorDTO.fromEntity(conductorActualizado);
  }

  async eliminarConductor(id: string): Promise<void> {
    this.validarId(id);

    if (!await this.repositorio.eliminarConductor(id)) {
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
