import { DispositivoGPS } from "../Domain/DispositivoGPS";
import { IRepositorioDispositivoGPS } from "../IDataAccess/IRepositorioDispositivoGPS";

export class RepositorioDispositivoGPS implements IRepositorioDispositivoGPS {
  private dispositivos: DispositivoGPS[] = [];
  private proximoId: number = 1;

  crearDispositivoGPS(): DispositivoGPS {
    const nuevoDispositivo = new DispositivoGPS(this.proximoId++);
    this.dispositivos.push(nuevoDispositivo);
    return nuevoDispositivo;
  }

  obtenerDispositivosGPS(): DispositivoGPS[] {
    return this.dispositivos;
  }

  obtenerDispositivoGPSPorId(id: number): DispositivoGPS | undefined {
    return this.dispositivos.find(dispositivo => dispositivo.getId() === id);
  }

  actualizarDispositivoGPS(id: number): DispositivoGPS | undefined {
    let dispositivoActualizado: DispositivoGPS | undefined;

    this.dispositivos = this.dispositivos.map(dispositivo => {
      if (dispositivo.getId() !== id) {
        return dispositivo;
      }

      dispositivoActualizado = new DispositivoGPS(id);
      return dispositivoActualizado;
    });

    return dispositivoActualizado;
  }

  eliminarDispositivoGPS(id: number): boolean {
    const originalLength = this.dispositivos.length;
    this.dispositivos = this.dispositivos.filter(dispositivo => dispositivo.getId() !== id);
    return this.dispositivos.length !== originalLength;
  }

  existe(id: number): boolean {
    return this.dispositivos.some(dispositivo => dispositivo.getId() === id);
  }
}
