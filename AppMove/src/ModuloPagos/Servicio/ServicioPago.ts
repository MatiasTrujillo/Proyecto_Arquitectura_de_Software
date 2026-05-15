import { Pago } from "../Domain/Pago";
import { EstadoPago } from "../Domain/EstadoPago";
import { IRepositorioPago } from "../IDataAccess/IRepositorioPago";
import { IServicioPago } from "../IServicio/IServicioPago";

export class ServicioPago implements IServicioPago {
  constructor(private repositorio: IRepositorioPago) {}

  crearPago(fecha: string | Date, monto: number, estado: string): Pago {
    const fechaValida = this.validarFecha(fecha);
    const montoValido = this.validarMonto(monto);
    const estadoValido = this.validarEstado(estado);

    return this.repositorio.crearPago(fechaValida, montoValido, estadoValido);
  }

  obtenerPagos(): Pago[] {
    return this.repositorio.obtenerPagos();
  }

  obtenerPagoPorId(id: number): Pago {
    const idValido = this.validarId(id);
    const pago = this.repositorio.obtenerPagoPorId(idValido);

    if (!pago) {
      throw new Error(`No se encontró el pago con id ${idValido}`);
    }

    return pago;
  }

  actualizarPago(id: number, fecha: string | Date, monto: number, estado: string): Pago {
    const idValido = this.validarId(id);
    const fechaValida = this.validarFecha(fecha);
    const montoValido = this.validarMonto(monto);
    const estadoValido = this.validarEstado(estado);

    if (!this.repositorio.existe(idValido)) {
      throw new Error(`No se encontró el pago con id ${idValido}`);
    }

    const pagoActualizado = this.repositorio.actualizarPago(idValido, fechaValida, montoValido, estadoValido);
    if (!pagoActualizado) {
      throw new Error(`No se pudo actualizar el pago con id ${idValido}`);
    }

    return pagoActualizado;
  }

  eliminarPago(id: number): void {
    const idValido = this.validarId(id);

    if (!this.repositorio.eliminarPago(idValido)) {
      throw new Error(`No se encontró el pago con id ${idValido}`);
    }
  }

  private validarId(id: number): number {
    if (typeof id !== "number" || Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {
      throw new Error("Id de pago inválido");
    }
    return id;
  }

  private validarMonto(monto: number): number {
    if (typeof monto !== "number" || Number.isNaN(monto) || monto <= 0) {
      throw new Error("Monto inválido. Debe ser un número mayor que cero.");
    }
    return monto;
  }

  private validarFecha(fecha: string | Date): Date {
    const valor = fecha instanceof Date ? fecha : new Date(fecha);

    if (Number.isNaN(valor.getTime())) {
      throw new Error("Fecha inválida.");
    }

    return valor;
  }

  private validarEstado(estado: string): EstadoPago {
    const valor = estado?.toString().toLowerCase();
    const estadosValidos = Object.values(EstadoPago) as string[];

    if (!estadosValidos.includes(valor)) {
      throw new Error(`Estado inválido. Valores válidos: ${estadosValidos.join(", ")}`);
    }

    return valor as EstadoPago;
  }
}
