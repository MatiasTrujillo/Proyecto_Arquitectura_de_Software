export class Incidente {
  private id: string;
  private descripcion: string;
  private fecha: Date;
  private reservaId: string;
  private estado: string;
  private severidad: string;

  constructor(
    id: string,
    descripcion: string,
    fecha: Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ) {
    this.id = id;
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.reservaId = reservaId;
    this.estado = estado;
    this.severidad = severidad;
  }

  getId(): string {
    return this.id;
  }

  getDescripcion(): string {
    return this.descripcion;
  }

  getFecha(): Date {
    return this.fecha;
  }

  getReservaId(): string {
    return this.reservaId;
  }

  getEstado(): string {
    return this.estado;
  }

  getSeveridad(): string {
    return this.severidad;
  }
}
