import { ViajeDTO } from "../DTOs/ViajeDTO";
import { FiltrosViajeEnCurso } from "../IDataAccess/IRepositorioViaje";

export interface IServicioViaje {
  crearViaje(reservaId: string, origen: string, destino: string, fecha: string | Date, estado: string, conductor: string, vehiculo: string): Promise<ViajeDTO>;
  obtenerViajes(): Promise<ViajeDTO[]>;
  obtenerViajePorId(id: string): Promise<ViajeDTO>;
  obtenerViajePorReservaId(reservaId: string): Promise<ViajeDTO | undefined>;
  obtenerViajesPorConductor(conductorId: string): Promise<ViajeDTO[]>;
  obtenerViajesEnCurso(filtros?: FiltrosViajeEnCurso): Promise<ViajeDTO[]>;
  iniciarTraslado(id: string, conductorId: string): Promise<ViajeDTO>;
  finalizarTraslado(id: string, conductorId: string): Promise<ViajeDTO>;
  actualizarViaje(id: string, reservaId: string, origen: string, destino: string, fecha: string | Date, estado: string, conductor: string, vehiculo: string): Promise<ViajeDTO>;
  eliminarViaje(id: string): Promise<void>;
}
