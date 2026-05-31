import { PagoDTO } from "../DTOs/PagoDTO";
import { IRepositorioPago } from "../IDataAccess/IRepositorioPago";
import { IServicioPago } from "../IServicio/IServicioPago";

export class ServicioPago implements IServicioPago {
  constructor(private repositorio: IRepositorioPago) {}

  async crearPago(fecha: string | Date, monto: number, estado: string): Promise<PagoDTO> {
    const fechaValida = this.validarFecha(fecha);
    const montoValido = this.validarMonto(monto);
    const estadoValido = this.validarEstado(estado);

    const pago = await this.repositorio.crearPago(fechaValida, montoValido, estadoValido as any);
    return PagoDTO.fromEntity(pago);
  }

  async obtenerPagos(): Promise<PagoDTO[]> {
    const pagos = await this.repositorio.obtenerPagos();
    return pagos.map(pago => PagoDTO.fromEntity(pago));
  }

  async obtenerPagoPorId(id: number): Promise<PagoDTO> {
    const idValido = this.validarId(id);
    const pago = await this.repositorio.obtenerPagoPorId(idValido);

    if (!pago) {
      throw new Error(`No se encontró el pago con id ${idValido}`); //hay que crear excepciones personalizadas para cada caso
    }

    return PagoDTO.fromEntity(pago);
  }

  async actualizarPago(id: number, fecha: string | Date, monto: number, estado: string): Promise<PagoDTO> {
    const idValido = this.validarId(id);
    const fechaValida = this.validarFecha(fecha);
    const montoValido = this.validarMonto(monto);
    const estadoValido = this.validarEstado(estado);

    if (!await this.repositorio.existe(idValido)) {
      throw new Error(`No se encontró el pago con id ${idValido}`); //hay que crear excepciones personalizadas para cada caso
    }

    const pagoActualizado = await this.repositorio.actualizarPago(idValido, fechaValida, montoValido, estadoValido as any);
    if (!pagoActualizado) {
      throw new Error(`No se pudo actualizar el pago con id ${idValido}`); //hay que crear excepciones personalizadas para cada caso
    }

    return PagoDTO.fromEntity(pagoActualizado);
  }

  async eliminarPago(id: number): Promise<void> {
    const idValido = this.validarId(id);

    if (!await this.repositorio.eliminarPago(idValido)) {
      throw new Error(`No se encontró el pago con id ${idValido}`);
    }
  }

  private validarId(id: number): number {
    if (typeof id !== "number" || Number.isNaN(id) || id <= 0) {
      throw new Error("Id de pago inválido"); //hay que crear excepciones personalizadas para cada caso
    }
    return id;
  }

  private validarMonto(monto: number): number {
    if (typeof monto !== "number" || Number.isNaN(monto) || monto <= 0) {
      throw new Error("Monto inválido. Debe ser un número mayor que cero."); //hay que crear excepciones personalizadas para cada caso
    }
    return monto;
  }

  private validarFecha(fecha: string | Date): Date {
    const valor = fecha instanceof Date ? fecha : new Date(fecha);

    if (Number.isNaN(valor.getTime())) {
      throw new Error("Fecha inválida."); //hay que crear excepciones personalizadas para cada caso
    }

    return valor;
  }

  private validarEstado(estado: string): string {
    if (!estado || typeof estado !== "string" || estado.trim().length === 0) {
      throw new Error("Estado inválido. Debe ser un texto no vacío.");
    }

    return estado.trim();
  }
}
