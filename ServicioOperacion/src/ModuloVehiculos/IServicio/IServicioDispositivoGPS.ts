import { DispositivoGPSDTO } from "../DTOs/DispositivoGPSDTO";

export interface IServicioDispositivoGPS {
  crearDispositivoGPS(): DispositivoGPSDTO;
  obtenerDispositivosGPS(): DispositivoGPSDTO[];
  obtenerDispositivoGPSPorId(id: number): DispositivoGPSDTO;
  actualizarDispositivoGPS(id: number): DispositivoGPSDTO;
  eliminarDispositivoGPS(id: number): void;
}
