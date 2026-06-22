import { DispositivoGPSDTO } from "../DTOs/DispositivoGPSDTO";

export interface IServicioDispositivoGPS {
  crearDispositivoGPS(nombre: string): Promise<DispositivoGPSDTO>;
  obtenerDispositivosGPS(): Promise<DispositivoGPSDTO[]>;
  obtenerDispositivoGPSPorId(id: number): Promise<DispositivoGPSDTO>;
  actualizarDispositivoGPS(id: number, nombre: string): Promise<DispositivoGPSDTO>;
  eliminarDispositivoGPS(id: number): Promise<void>;
}
