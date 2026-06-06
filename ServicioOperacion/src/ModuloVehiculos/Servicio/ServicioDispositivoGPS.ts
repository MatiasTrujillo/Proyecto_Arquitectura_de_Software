import { DispositivoGPSDTO } from "../DTOs/DispositivoGPSDTO";
import { IRepositorioDispositivoGPS } from "../IDataAccess/IRepositorioDispositivoGPS";
import { IServicioDispositivoGPS } from "../IServicio/IServicioDispositivoGPS";

export class ServicioDispositivoGPS implements IServicioDispositivoGPS {
  constructor(private repositorio: IRepositorioDispositivoGPS) {}

  async crearDispositivoGPS(ubicacion: string): Promise<DispositivoGPSDTO> {
    const ubicacionValida = this.validarUbicacion(ubicacion);
    const dispositivo = await this.repositorio.crearDispositivoGPS(ubicacionValida);
    return DispositivoGPSDTO.fromEntity(dispositivo);
  }

  async obtenerDispositivosGPS(): Promise<DispositivoGPSDTO[]> {
    const dispositivos = await this.repositorio.obtenerDispositivosGPS();
    return dispositivos.map(d => DispositivoGPSDTO.fromEntity(d));
  }

  async obtenerDispositivoGPSPorId(id: number): Promise<DispositivoGPSDTO> {
    const idValido = this.validarId(id);
    const dispositivo = await this.repositorio.obtenerDispositivoGPSPorId(idValido);

    if (!dispositivo) {
      throw new Error(`No se encontró el dispositivo GPS con id ${idValido}`);
    }

    return DispositivoGPSDTO.fromEntity(dispositivo);
  }

  async actualizarDispositivoGPS(id: number, ubicacion: string): Promise<DispositivoGPSDTO> {
    const idValido = this.validarId(id);
    const ubicacionValida = this.validarUbicacion(ubicacion);

    if (!await this.repositorio.existe(idValido)) {
      throw new Error(`No se encontró el dispositivo GPS con id ${idValido}`);
    }

    const dispositivoActualizado = await this.repositorio.actualizarDispositivoGPS(idValido, ubicacionValida);
    if (!dispositivoActualizado) {
      throw new Error(`No se pudo actualizar el dispositivo GPS con id ${idValido}`);
    }

    return DispositivoGPSDTO.fromEntity(dispositivoActualizado);
  }

  async eliminarDispositivoGPS(id: number): Promise<void> {
    const idValido = this.validarId(id);

    if (!await this.repositorio.eliminarDispositivoGPS(idValido)) {
      throw new Error(`No se encontró el dispositivo GPS con id ${idValido}`);
    }
  }

  private validarId(id: number): number {
    if (typeof id !== "number" || Number.isNaN(id) || id <= 0) {
      throw new Error("Id de dispositivo GPS inválido");
    }
    return id;
  }

  private validarUbicacion(ubicacion: string): string {
    if (typeof ubicacion !== "string" || ubicacion.trim().length === 0) {
      throw new Error("Ubicación de dispositivo GPS inválida");
    }
    return ubicacion.trim();
  }
}
