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

  getId(): number { return this.id; }
  getFecha(): Date { return this.fecha; }
  getMonto(): number { return this.monto; }
  getEstado(): string { return this.estado; }
  getReservaId(): string { return this.reservaId; }
  getProveedor(): string { return this.proveedor; }
}
