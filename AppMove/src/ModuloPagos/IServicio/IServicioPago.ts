import { PagoDTO } from "../DTOs/PagoDTO";

export interface IServicioPago {
  crearPago(fecha: string | Date, monto: number, estado: string): PagoDTO;
  obtenerPagos(): PagoDTO[];
  obtenerPagoPorId(id: number): PagoDTO;
  actualizarPago(id: number, fecha: string | Date, monto: number, estado: string): PagoDTO;
  eliminarPago(id: number): void;
}
