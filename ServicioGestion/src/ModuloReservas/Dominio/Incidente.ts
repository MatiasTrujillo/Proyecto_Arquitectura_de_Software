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

  getId(): string { return this.id; }
  getDescripcion(): string { return this.descripcion; }
  getFecha(): Date { return this.fecha; }
  getReservaId(): string { return this.reservaId; }
  getEstado(): string { return this.estado; }
  getSeveridad(): string { return this.severidad; }
  getConductorId(): string { return this.conductorId; }
}
