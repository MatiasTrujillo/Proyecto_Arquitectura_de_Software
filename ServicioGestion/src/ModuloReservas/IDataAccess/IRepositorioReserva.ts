import { Reserva } from "../Dominio/Reserva";

export interface IRepositorioReserva {
  crearReserva(cliente: string, origen: string, destino: string, fecha: Date, estado: string, costo: number, vehiculo: string | null, productos: string[], conductor: string | null, categorias: string[]): Promise<Reserva>;
  obtenerReservas(): Promise<Reserva[]>;
  obtenerReservaPorId(id: string): Promise<Reserva | undefined>;
  obtenerReservasPorCliente(clienteId: string): Promise<Reserva[]>;
  actualizarEstadoReserva(id: string, estado: string): Promise<Reserva | undefined>;
  asignarVehiculoConductor(id: string, vehiculo: string, conductor: string): Promise<Reserva | undefined>;
  asignarYCrearViajeAtomico(id: string, vehiculo: string, conductor: string): Promise<Reserva | undefined>;
  obtenerReservasSinViaje(): Promise<Reserva[]>;
  existe(id: string): Promise<boolean>;
  obtenerTamanoTotalProductos(reservaId: string): Promise<number>;
  vehiculoEnViajeActivo(vehiculo: string): Promise<boolean>;
  obtenerVehiculosOcupados(): Promise<string[]>;
}
