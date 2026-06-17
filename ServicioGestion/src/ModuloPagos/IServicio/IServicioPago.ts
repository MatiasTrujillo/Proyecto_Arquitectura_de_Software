import { PagoDTO } from "../DTOs/PagoDTO";

export interface IServicioPago {
  crearPago(fecha: string | Date, monto: number, estado: string, reservaId: string): Promise<PagoDTO>;
  obtenerPagos(): Promise<PagoDTO[]>;
  obtenerPagoPorId(id: number): Promise<PagoDTO>;
  actualizarPago(id: number, fecha: string | Date, monto: number, estado: string, reservaId: string): Promise<PagoDTO>;
  eliminarPago(id: number): Promise<void>;
}
