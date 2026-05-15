import { Pago } from "../Domain/Pago";
import { EstadoPago } from "../Domain/EstadoPago";
import { IRepositorioPago } from "../IDataAccess/IRepositorioPago";

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
  actualizarPago(id: number, fecha: Date, monto: number, estado: EstadoPago): Pago | undefined {
    const index = this.pagos.findIndex(p => p.getId() === id);

    if (index === -1) {
      return undefined;
    }

    const pagoActualizado = new Pago(id, fecha, monto, estado);
    this.pagos[index] = pagoActualizado;
    return pagoActualizado;
  }

  // Eliminar un pago
  eliminarPago(id: number): boolean {
    const index = this.pagos.findIndex(pago => pago.getId() === id);

    if (index === -1) {
      return false;
    }

    this.pagos.splice(index, 1);
    return true;
  }

  existe(id: number): boolean {
    return this.pagos.some(pago => pago.getId() === id);
  }
}