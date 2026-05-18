import { DispositivoGPS } from "../Domain/DispositivoGPS";

export interface IRepositorioDispositivoGPS {
  crearDispositivoGPS(): DispositivoGPS;
  obtenerDispositivosGPS(): DispositivoGPS[];
  obtenerDispositivoGPSPorId(id: number): DispositivoGPS | undefined;
  actualizarDispositivoGPS(id: number): DispositivoGPS | undefined;
  eliminarDispositivoGPS(id: number): boolean;
  existe(id: number): boolean;
}
