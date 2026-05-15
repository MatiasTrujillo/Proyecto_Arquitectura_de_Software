import { Pago } from "../Domain/Pago";
import { EstadoPago } from "../Domain/EstadoPago";

export interface IRepositorioPago {
  crearPago(fecha: Date, monto: number, estado: EstadoPago): Pago;
  obtenerPagos(): Pago[];
  obtenerPagoPorId(id: number): Pago | undefined;
  actualizarPago(id: number, fecha: Date, monto: number, estado: EstadoPago): Pago | undefined;
  eliminarPago(id: number): boolean;
  existe(id: number): boolean;
}
