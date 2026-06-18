import { Viaje } from "../Dominio/Viaje";

export interface FiltrosViajeEnCurso {
  vehiculo?: string;
  conductor?: string;
  tieneAlertas?: boolean;
}

export interface IRepositorioViaje {
  crearViaje(reservaId: string, origen: string, destino: string, fecha: Date, estado: string, conductor: string, vehiculo: string): Promise<Viaje>;
  obtenerViajes(): Promise<Viaje[]>;
  obtenerViajePorId(id: string): Promise<Viaje | undefined>;
  obtenerViajePorReservaId(reservaId: string): Promise<Viaje | undefined>;
  obtenerViajesPorConductor(conductorId: string): Promise<Viaje[]>;
  obtenerViajesEnCurso(filtros?: FiltrosViajeEnCurso): Promise<Viaje[]>;
  actualizarViaje(id: string, reservaId: string, origen: string, destino: string, fecha: Date, estado: string, conductor: string, vehiculo: string): Promise<Viaje | undefined>;
  actualizarEstadoViaje(id: string, estado: string): Promise<Viaje | undefined>;
  eliminarViaje(id: string): Promise<boolean>;
  existe(id: string): Promise<boolean>;
}
