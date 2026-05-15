import { Pago } from "../Pago";
import { EstadoPago } from "../EstadoPago";
import { IRepositorioPago } from "../../IDataAccess/IRepositorioPago";

export class RepositorioPago implements IRepositorioPago {
  private pagos: Pago[] = [];
  private proximoId: number = 1;

  // Crear un nuevo pago
  crearPago(fecha: Date, monto: number, estado: EstadoPago): Pago {
    const nuevoPago = new Pago(this.proximoId++, fecha, monto, estado);
    this.pagos.push(nuevoPago);
    return nuevoPago;
  }

  // Obtener todos los pagos
  obtenerPagos(): Pago[] {
    return this.pagos;
  }

  // Obtener un pago por ID
  obtenerPagoPorId(id: number): Pago | undefined {
    return this.pagos.find(pago => pago.getId() === id);
  }

  // Actualizar un pago
  actualizarPago(id: number, fecha: Date, monto: number, estado: EstadoPago): Pago {
    const pago = this.obtenerPagoPorId(id);
    const pagoActualizado = new Pago(id, fecha, monto, estado);
    const index = this.pagos.findIndex(p => p.getId() === id);
    this.pagos[index] = pagoActualizado;
    return pagoActualizado;
  }

  // Eliminar un pago
  eliminarPago(id: number): boolean {
    const index = this.pagos.findIndex(pago => pago.getId() === id);
    this.pagos.splice(index, 1);
    return index !== -1;
  }
}