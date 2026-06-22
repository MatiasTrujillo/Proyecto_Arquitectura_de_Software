import { VehiculoDTO } from "../DTOs/VehiculoDTO";
import { IRepositorioVehiculo } from "../IDataAccess/IRepositorioVehiculo";
import { IServicioVehiculo } from "../IServicio/IServicioVehiculo";

export class ServicioVehiculo implements IServicioVehiculo {
  constructor(private repositorio: IRepositorioVehiculo) {}

  async crearVehiculo(matricula: string, tipo: string, capacidad: number, dispositivoGps: string): Promise<VehiculoDTO> {
    const matriculaValida = this.validarMatricula(matricula);
    const tipoValido = this.validarTipo(tipo);
    const capacidadValida = this.validarCapacidad(capacidad);
    const dispositivoValido = this.validarDispositivo(dispositivoGps);

    const v = await this.repositorio.crearVehiculo(matriculaValida, tipoValido, capacidadValida, dispositivoValido);
    return VehiculoDTO.fromEntity(v);
  }

  async obtenerVehiculos(): Promise<VehiculoDTO[]> {
    const vs = await this.repositorio.obtenerVehiculos();
    return vs.map(v => VehiculoDTO.fromEntity(v));
  }

  async obtenerVehiculoPorId(id: number): Promise<VehiculoDTO> {
    const idValido = this.validarId(id);
    const v = await this.repositorio.obtenerVehiculoPorId(idValido);
    if (!v) throw new Error(`No se encontró el vehículo con id ${idValido}`);
    return VehiculoDTO.fromEntity(v);
  }

  async actualizarVehiculo(id: number, matricula: string, tipo: string, capacidad: number, dispositivoGps: string): Promise<VehiculoDTO> {
    const idValido = this.validarId(id);
    const matriculaValida = this.validarMatricula(matricula);
    const tipoValido = this.validarTipo(tipo);
    const capacidadValida = this.validarCapacidad(capacidad);
    const dispositivoValido = this.validarDispositivo(dispositivoGps);

    if (!await this.repositorio.existe(idValido)) {
      throw new Error(`No se encontró el vehículo con id ${idValido}`);
    }

    const actualizado = await this.repositorio.actualizarVehiculo(idValido, matriculaValida, tipoValido, capacidadValida, dispositivoValido);
    if (!actualizado) throw new Error(`No se pudo actualizar el vehículo con id ${idValido}`);
    return VehiculoDTO.fromEntity(actualizado);
  }

  async obtenerVehiculoPorMatricula(matricula: string): Promise<VehiculoDTO> {
    if (!matricula || matricula.trim().length === 0) throw new Error("Matrícula inválida");
    const v = await this.repositorio.obtenerPorMatricula(matricula.trim());
    if (!v) throw new Error(`No se encontró el vehículo con matrícula ${matricula}`);
    return VehiculoDTO.fromEntity(v);
  }

  async eliminarVehiculo(id: number): Promise<void> {
    const idValido = this.validarId(id);
    if (!await this.repositorio.eliminarVehiculo(idValido)) {
      throw new Error(`No se encontró el vehículo con id ${idValido}`);
    }
  }

  private validarId(id: number): number {
    if (typeof id !== "number" || Number.isNaN(id) || id <= 0) throw new Error("Id de vehículo inválido");
    return id;
  }

  private validarMatricula(m: string): string {
    if (!m || m.trim().length === 0) throw new Error("Matrícula inválida");
    return m.trim();
  }

  private validarTipo(t: string): string {
    if (!t || t.trim().length === 0) throw new Error("Tipo inválido");
    return t.trim();
  }

  private validarCapacidad(c: number): number {
    if (typeof c !== "number" || Number.isNaN(c) || c < 0) throw new Error("Capacidad inválida");
    return c;
  }

  private validarDispositivo(d: string): string {
    if (!d || String(d).trim().length === 0) throw new Error("El dispositivo GPS es obligatorio");
    return String(d).trim();
  }
}
