import { Viaje } from "../Dominio/Viaje";

export interface IRepositorioViaje {
  crearViaje(
    reservaId: string,
    origen: string,
    destino: string,
    fecha: Date,
    estado: string,
    conductor: string,
  ): Viaje;
  obtenerViajes(): Viaje[];
  obtenerViajePorId(id: string): Viaje | undefined;
  actualizarViaje(
    id: string,
    reservaId: string,
    origen: string,
    destino: string,
    fecha: Date,
    estado: string,
    conductor: string,
  ): Viaje | undefined;
  eliminarViaje(id: string): boolean;
  existe(id: string): boolean;
}
