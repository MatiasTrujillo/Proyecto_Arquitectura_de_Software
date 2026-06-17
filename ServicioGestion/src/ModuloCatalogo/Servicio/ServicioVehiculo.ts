import { VehiculoDTO } from "../DTOs/VehiculoDTO";
import { IRepositorioVehiculo } from "../IDataAccess/IRepositorioVehiculo";
import { IServicioVehiculo } from "../IServicio/IServicioVehiculo";

export class ServicioVehiculo implements IServicioVehiculo {
  constructor(private repositorio: IRepositorioVehiculo) {}

  async crearVehiculo(matricula: string, tipo: string, capacidad: number, dispositivoGPS: string, disponible: boolean, caracteristicas: Record<string, string>): Promise<VehiculoDTO> {
    if (!matricula?.trim()) throw new Error("Matrícula inválida.");
    if (!tipo?.trim()) throw new Error("Tipo inválido.");
    if (typeof capacidad !== 'number' || capacidad <= 0) throw new Error("Capacidad debe ser mayor a 0.");
    const vehiculo = await this.repositorio.crearVehiculo(matricula.trim(), tipo.trim(), capacidad, dispositivoGPS ?? '', disponible ?? true, caracteristicas ?? {});
    return VehiculoDTO.fromEntity(vehiculo);
  }

  async obtenerVehiculos(): Promise<VehiculoDTO[]> {
    const vehiculos = await this.repositorio.obtenerVehiculos();
    return vehiculos.map(v => VehiculoDTO.fromEntity(v));
  }

  async obtenerVehiculoPorId(id: string): Promise<VehiculoDTO> {
    if (!id?.trim()) throw new Error("Id inválido.");
    const vehiculo = await this.repositorio.obtenerVehiculoPorId(id);
    if (!vehiculo) throw new Error(`No se encontró el vehículo con id ${id}`);
    return VehiculoDTO.fromEntity(vehiculo);
  }

  async actualizarVehiculo(id: string, matricula: string, tipo: string, capacidad: number, dispositivoGPS: string, disponible: boolean, caracteristicas: Record<string, string>): Promise<VehiculoDTO> {
    if (!id?.trim()) throw new Error("Id inválido.");
    if (!await this.repositorio.existe(id)) throw new Error(`No se encontró el vehículo con id ${id}`);
    if (!matricula?.trim()) throw new Error("Matrícula inválida.");
    if (!tipo?.trim()) throw new Error("Tipo inválido.");
    if (typeof capacidad !== 'number' || capacidad <= 0) throw new Error("Capacidad debe ser mayor a 0.");
    const actualizado = await this.repositorio.actualizarVehiculo(id, matricula.trim(), tipo.trim(), capacidad, dispositivoGPS ?? '', disponible ?? true, caracteristicas ?? {});
    if (!actualizado) throw new Error(`No se pudo actualizar el vehículo con id ${id}`);
    return VehiculoDTO.fromEntity(actualizado);
  }

  async eliminarVehiculo(id: string): Promise<void> {
    if (!id?.trim()) throw new Error("Id inválido.");
    if (!await this.repositorio.eliminarVehiculo(id)) throw new Error(`No se encontró el vehículo con id ${id}`);
  }
}
