import { DispositivoGPSDTO } from "../DTOs/DispositivoGPSDTO";

export interface IServicioDispositivoGPS {
  crearDispositivoGPS(ubicacion: string): Promise<DispositivoGPSDTO>;
  obtenerDispositivosGPS(): Promise<DispositivoGPSDTO[]>;
  obtenerDispositivoGPSPorId(id: number): Promise<DispositivoGPSDTO>;
  actualizarDispositivoGPS(id: number, ubicacion: string): Promise<DispositivoGPSDTO>;
  eliminarDispositivoGPS(id: number): Promise<void>;
}
