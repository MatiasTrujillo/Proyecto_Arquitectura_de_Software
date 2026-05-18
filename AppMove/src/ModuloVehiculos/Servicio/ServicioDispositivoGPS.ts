import { DispositivoGPS } from "../Domain/DispositivoGPS";
import { IRepositorioDispositivoGPS } from "../IDataAccess/IRepositorioDispositivoGPS";
import { IServicioDispositivoGPS } from "../IServicio/IServicioDispositivoGPS";

export class ServicioDispositivoGPS implements IServicioDispositivoGPS {
  constructor(private repositorio: IRepositorioDispositivoGPS) {}

  crearDispositivoGPS(): DispositivoGPS {
    return this.repositorio.crearDispositivoGPS();
  }

  obtenerDispositivosGPS(): DispositivoGPS[] {
    return this.repositorio.obtenerDispositivosGPS();
  }

  obtenerDispositivoGPSPorId(id: number): DispositivoGPS {
    const idValido = this.validarId(id);
    const dispositivo = this.repositorio.obtenerDispositivoGPSPorId(idValido);

    if (!dispositivo) {
      throw new Error(`No se encontró el dispositivo GPS con id ${idValido}`);
    }

    return dispositivo;
  }

  actualizarDispositivoGPS(id: number): DispositivoGPS {
    const idValido = this.validarId(id);

    if (!this.repositorio.existe(idValido)) {
      throw new Error(`No se encontró el dispositivo GPS con id ${idValido}`);
    }

    const dispositivoActualizado = this.repositorio.actualizarDispositivoGPS(idValido);
    if (!dispositivoActualizado) {
      throw new Error(`No se pudo actualizar el dispositivo GPS con id ${idValido}`);
    }

    return dispositivoActualizado;
  }

  eliminarDispositivoGPS(id: number): void {
    const idValido = this.validarId(id);

    if (!this.repositorio.eliminarDispositivoGPS(idValido)) {
      throw new Error(`No se encontró el dispositivo GPS con id ${idValido}`);
    }
  }

  private validarId(id: number): number {
    if (typeof id !== "number" || Number.isNaN(id) || id <= 0) {
      throw new Error("Id de dispositivo GPS inválido");
    }
    return id;
  }
}
