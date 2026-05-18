export class Viaje {
  private id: string;
  private reservaId: string;
  private origen: string;
  private destino: string;
  private fecha: Date;
  private estado: string;
  private conductor: string;

  constructor(
    id: string,
    reservaId: string,
    origen: string,
    destino: string,
    fecha: Date,
    estado: string,
    conductor: string,
  ) {
    this.id = id;
    this.reservaId = reservaId;
    this.origen = origen;
    this.destino = destino;
    this.fecha = fecha;
    this.estado = estado;
    this.conductor = conductor;
  }

  getId(): string {
    return this.id;
  }

  getReservaId(): string {
    return this.reservaId;
  }

  getOrigen(): string {
    return this.origen;
  }

  getDestino(): string {
    return this.destino;
  }

  getFecha(): Date {
    return this.fecha;
  }

  getEstado(): string {
    return this.estado;
  }

  getConductor(): string {
    return this.conductor;
  }
}