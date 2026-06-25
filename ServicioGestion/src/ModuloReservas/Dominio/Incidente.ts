export class Incidente {
  constructor(
    private id: string,
    private descripcion: string,
    private fecha: Date,
    private reservaId: string,
    private estado: string,
    private severidad: string,
    private conductorId: string
  ) {}

  obtenerId(): string { return this.id; }
  obtenerDescripcion(): string { return this.descripcion; }
  obtenerFecha(): Date { return this.fecha; }
  obtenerReservaId(): string { return this.reservaId; }
  obtenerEstado(): string { return this.estado; }
  obtenerSeveridad(): string { return this.severidad; }
  obtenerConductorId(): string { return this.conductorId; }
}
