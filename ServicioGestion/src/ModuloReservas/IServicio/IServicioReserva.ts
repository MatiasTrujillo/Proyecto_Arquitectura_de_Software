import { ReservaDTO } from "../DTOs/ReservaDTO";

export interface IServicioReserva {
  crearReserva(
    clienteId: string,
    origen: string,
    destino: string,
    fecha: string | Date,
    costo: number,
    vehiculo: string,
    productos: string[],
    conductor: string,
    categorias: string[]
  ): Promise<ReservaDTO>;
  obtenerReservas(): Promise<ReservaDTO[]>;
  obtenerReservaPorId(reservaId: string): Promise<ReservaDTO>;
  obtenerReservasPorCliente(clienteId: string): Promise<ReservaDTO[]>;
  consultarEstadoReserva(reservaId: string): Promise<string>;
  actualizarEstadoReserva(reservaId: string, estado: string): Promise<ReservaDTO>;
}
