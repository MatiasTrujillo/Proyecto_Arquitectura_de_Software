import { Pago } from "../Domain/Pago";
import { EstadoPago } from "../Domain/EstadoPago";

export interface IRepositorioPago {
  crearPago(fecha: Date, monto: number, estado: EstadoPago): Promise<Pago>;
  obtenerPagos(): Promise<Pago[]>;
  obtenerPagoPorId(id: number): Promise<Pago | undefined>;
  actualizarPago(id: number, fecha: Date, monto: number, estado: EstadoPago): Promise<Pago | undefined>;
  eliminarPago(id: number): Promise<boolean>;
  existe(id: number): Promise<boolean>;
}
