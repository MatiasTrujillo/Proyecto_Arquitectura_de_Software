import { ViajeDTO } from "../DTOs/ViajeDTO";

export interface IServicioViaje {
  crearViaje(
    reservaId: string,
    origen: string,
    destino: string,
    fecha: string | Date,
    estado: string,
    conductor: string,
  ): ViajeDTO;
  obtenerViajes(): ViajeDTO[];
  obtenerViajePorId(id: string): ViajeDTO;
  actualizarViaje(
    id: string,
    reservaId: string,
    origen: string,
    destino: string,
    fecha: string | Date,
    estado: string,
    conductor: string,
  ): ViajeDTO;
  eliminarViaje(id: string): void;
}
