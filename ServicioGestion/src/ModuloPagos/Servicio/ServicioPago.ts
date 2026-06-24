import { PagoDTO } from "../DTOs/PagoDTO";
import { IRepositorioPago } from "../IDataAccess/IRepositorioPago";
import { IServicioPago } from "../IServicio/IServicioPago";

export class ServicioPago implements IServicioPago {
  constructor(private repositorio: IRepositorioPago) {}

  async crearPago(fecha: string | Date, monto: number, estado: string, reservaId: string, proveedor: string = 'stripe'): Promise<PagoDTO> {
    const pago = await this.repositorio.crearPago(
      this.validarFecha(fecha),
      this.validarMonto(monto),
      this.validarEstado(estado) as any,
      reservaId ?? '',
      proveedor
    );
    return PagoDTO.fromEntity(pago);
  }

  async obtenerPagos(): Promise<PagoDTO[]> {
    const pagos = await this.repositorio.obtenerPagos();
    return pagos.map(pago => PagoDTO.fromEntity(pago));
  }

  async obtenerPagoPorId(id: number): Promise<PagoDTO> {
    const pago = await this.repositorio.obtenerPagoPorId(this.validarId(id));
    if (!pago) throw new Error(`No se encontró el pago con id ${id}`);
    return PagoDTO.fromEntity(pago);
  }

  async actualizarPago(id: number, fecha: string | Date, monto: number, estado: string, reservaId: string): Promise<PagoDTO> {
    const idValido = this.validarId(id);
    if (!await this.repositorio.existe(idValido)) throw new Error(`No se encontró el pago con id ${idValido}`);
    const actualizado = await this.repositorio.actualizarPago(
      idValido,
      this.validarFecha(fecha),
      this.validarMonto(monto),
      this.validarEstado(estado) as any,
      reservaId ?? ''
    );
    if (!actualizado) throw new Error(`No se pudo actualizar el pago con id ${idValido}`);
    return PagoDTO.fromEntity(actualizado);
  }

  async eliminarPago(id: number): Promise<void> {
    if (!await this.repositorio.eliminarPago(this.validarId(id))) throw new Error(`No se encontró el pago con id ${id}`);
  }

  private validarId(id: number): number {
    if (typeof id !== "number" || Number.isNaN(id) || id <= 0) throw new Error("Id de pago inválido");
    return id;
  }

  private validarMonto(monto: number): number {
    if (typeof monto !== "number" || Number.isNaN(monto) || monto <= 0) throw new Error("Monto inválido. Debe ser un número mayor que cero.");
    return monto;
  }

  private validarFecha(fecha: string | Date): Date {
    const valor = fecha instanceof Date ? fecha : new Date(fecha);
    if (Number.isNaN(valor.getTime())) throw new Error("Fecha inválida.");
    return valor;
  }

  private validarEstado(estado: string): string {
    if (!estado?.trim()) throw new Error("Estado inválido.");
    return estado.trim();
  }
}
