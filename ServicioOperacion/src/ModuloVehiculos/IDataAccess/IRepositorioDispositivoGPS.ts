import { DispositivoGPS } from "../Domain/DispositivoGPS";

export interface IRepositorioDispositivoGPS {
  crearDispositivoGPS(nombre: string): Promise<DispositivoGPS>;
  obtenerDispositivosGPS(): Promise<DispositivoGPS[]>;
  obtenerDispositivoGPSPorId(id: number): Promise<DispositivoGPS | undefined>;
  actualizarDispositivoGPS(id: number, nombre: string): Promise<DispositivoGPS | undefined>;
  eliminarDispositivoGPS(id: number): Promise<boolean>;
  existe(id: number): Promise<boolean>;
}
