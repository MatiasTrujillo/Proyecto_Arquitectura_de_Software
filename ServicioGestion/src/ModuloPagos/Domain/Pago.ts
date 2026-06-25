import { EstadoPago } from "./EstadoPago";

export class Pago {
  constructor(
    private id: number,
    private fecha: Date,
    private monto: number,
    private estado: EstadoPago,
    private reservaId: string,
    private proveedor: string = 'stripe'
  ) {}

  obtenerId(): number { return this.id; }
  obtenerFecha(): Date { return this.fecha; }
  obtenerMonto(): number { return this.monto; }
  obtenerEstado(): string { return this.estado; }
  obtenerReservaId(): string { return this.reservaId; }
  obtenerProveedor(): string { return this.proveedor; }
}
