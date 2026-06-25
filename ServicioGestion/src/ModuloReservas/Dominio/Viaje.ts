export class Viaje {
  private id: string;
  private reservaId: string;
  private origen: string;
  private destino: string;
  private fecha: Date;
  private estado: string;
  private conductor: string;
  private vehiculo: string;
  private tieneAlertas: boolean;

  constructor(
    id: string,
    reservaId: string,
    origen: string,
    destino: string,
    fecha: Date,
    estado: string,
    conductor: string,
    vehiculo: string = '',
    tieneAlertas: boolean = false,
  ) {
    this.id = id;
    this.reservaId = reservaId;
    this.origen = origen;
    this.destino = destino;
    this.fecha = fecha;
    this.estado = estado;
    this.conductor = conductor;
    this.vehiculo = vehiculo;
    this.tieneAlertas = tieneAlertas;
  }

  obtenerId(): string { return this.id; }
  obtenerReservaId(): string { return this.reservaId; }
  obtenerOrigen(): string { return this.origen; }
  obtenerDestino(): string { return this.destino; }
  obtenerFecha(): Date { return this.fecha; }
  obtenerEstado(): string { return this.estado; }
  obtenerConductor(): string { return this.conductor; }
  obtenerVehiculo(): string { return this.vehiculo; }
  obtenerTieneAlertas(): boolean { return this.tieneAlertas; }
}
