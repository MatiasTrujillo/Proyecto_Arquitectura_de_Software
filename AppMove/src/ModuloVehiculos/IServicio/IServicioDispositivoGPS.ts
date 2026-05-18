import { DispositivoGPS } from "../Domain/DispositivoGPS";

export interface IServicioDispositivoGPS {
  crearDispositivoGPS(): DispositivoGPS;
  obtenerDispositivosGPS(): DispositivoGPS[];
  obtenerDispositivoGPSPorId(id: number): DispositivoGPS;
  actualizarDispositivoGPS(id: number): DispositivoGPS;
  eliminarDispositivoGPS(id: number): void;
}
