import { ReservaDTO } from "../DTOs/ReservaDTO";

export interface IServicioReserva {
  crearReserva(clienteId: string, origen: string, destino: string, fecha: string | Date, costo: number, productos: string[], categorias: string[], vehiculo?: string, conductor?: string): Promise<ReservaDTO>;
  obtenerReservas(): Promise<ReservaDTO[]>;
  obtenerReservaPorId(reservaId: string): Promise<ReservaDTO>;
  obtenerReservasPorCliente(clienteId: string, fechaDesde?: string, fechaHasta?: string, estado?: string): Promise<ReservaDTO[]>;
  consultarEstadoReserva(reservaId: string): Promise<string>;
  actualizarEstadoReserva(reservaId: string, estado: string): Promise<ReservaDTO>;
  asignarVehiculoConductor(reservaId: string, vehiculo: string, conductor: string): Promise<ReservaDTO>;
  asignarVehiculoConductorConViaje(reservaId: string, vehiculo: string, conductor: string): Promise<ReservaDTO>;
  obtenerReservasSinViaje(): Promise<ReservaDTO[]>;
}
