import { Viaje } from "../Dominio/Viaje";

export interface IServicioViaje {
  crearViaje(
    reservaId: string,
    origen: string,
    destino: string,
    fecha: string | Date,
    estado: string,
    conductor: string,
  ): Viaje;
  obtenerViajes(): Viaje[];
  obtenerViajePorId(id: string): Viaje;
  actualizarViaje(
    id: string,
    reservaId: string,
    origen: string,
    destino: string,
    fecha: string | Date,
    estado: string,
    conductor: string,
  ): Viaje;
  eliminarViaje(id: string): void;
}
