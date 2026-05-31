import { Viaje } from "../Dominio/Viaje";

export interface IRepositorioViaje {
  crearViaje(
    reservaId: string,
    origen: string,
    destino: string,
    fecha: Date,
    estado: string,
    conductor: string,
  ): Promise<Viaje>;
  obtenerViajes(): Promise<Viaje[]>;
  obtenerViajePorId(id: string): Promise<Viaje | undefined>;
  actualizarViaje(
    id: string,
    reservaId: string,
    origen: string,
    destino: string,
    fecha: Date,
    estado: string,
    conductor: string,
  ): Promise<Viaje | undefined>;
  eliminarViaje(id: string): Promise<boolean>;
  existe(id: string): Promise<boolean>;
}
