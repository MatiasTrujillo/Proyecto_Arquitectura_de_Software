import { Reserva } from "../Dominio/Reserva";

export interface IRepositorioReserva {
  crearReserva(
    cliente: string,
    origen: string,
    destino: string,
    fecha: Date,
    estado: string,
    costo: number,
    vehiculo: string,
    productos: string[],
    conductor: string,
    categorias: string[]
  ): Promise<Reserva>;
  obtenerReservas(): Promise<Reserva[]>;
  obtenerReservaPorId(id: string): Promise<Reserva | undefined>;
  obtenerReservasPorCliente(clienteId: string): Promise<Reserva[]>;
  actualizarEstadoReserva(id: string, estado: string): Promise<Reserva | undefined>;
  existe(id: string): Promise<boolean>;
}
