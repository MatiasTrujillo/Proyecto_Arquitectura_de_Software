export class Pago {
  private id: number;
  private fecha: Date;
  private monto: number;
  private estado: string; //EstadoPago

  constructor(id: number, fecha:Date, monto:number, estado:string) {
    this.id = id;
    this.fecha = fecha;
    this.monto = monto;
    this.estado = estado;
  }

  getId(): number {
    return this.id;
  }

  getFecha(): Date {
    return this.fecha;
  }

  getMonto(): number {
    return this.monto;
  }

  getEstado(): string {
    return this.estado;
  }
}