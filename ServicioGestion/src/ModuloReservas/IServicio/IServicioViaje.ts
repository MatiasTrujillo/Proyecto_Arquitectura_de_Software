import { ViajeDTO } from "../DTOs/ViajeDTO";

export interface IServicioViaje {
  crearViaje(
    reservaId: string,
    origen: string,
    destino: string,
    fecha: string | Date,
    estado: string,
    conductor: string,
  ): Promise<ViajeDTO>;
  obtenerViajes(): Promise<ViajeDTO[]>;
  obtenerViajePorId(id: string): Promise<ViajeDTO>;
  actualizarViaje(
    id: string,
    reservaId: string,
    origen: string,
    destino: string,
    fecha: string | Date,
    estado: string,
    conductor: string,
  ): Promise<ViajeDTO>;
  eliminarViaje(id: string): Promise<void>;
}
