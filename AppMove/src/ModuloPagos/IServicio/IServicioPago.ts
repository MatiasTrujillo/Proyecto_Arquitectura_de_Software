import { Pago } from "../Domain/Pago";

export interface IServicioPago {
  crearPago(fecha: string | Date, monto: number, estado: string): Pago;
  obtenerPagos(): Pago[];
  obtenerPagoPorId(id: number): Pago;
  actualizarPago(id: number, fecha: string | Date, monto: number, estado: string): Pago;
  eliminarPago(id: number): void;
}
