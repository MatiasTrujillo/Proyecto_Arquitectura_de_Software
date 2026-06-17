export class Vehiculo {
  constructor(
    private id: string,
    private matricula: string,
    private tipo: string,
    private capacidad: number,
    private dispositivoGPS: string,
    private disponible: boolean,
    private caracteristicas: Record<string, string>
  ) {}

  getId(): string { return this.id; }
  getMatricula(): string { return this.matricula; }
  getTipo(): string { return this.tipo; }
  getCapacidad(): number { return this.capacidad; }
  getDispositivoGPS(): string { return this.dispositivoGPS; }
  isDisponible(): boolean { return this.disponible; }
  getCaracteristicas(): Record<string, string> { return this.caracteristicas; }

  setDisponible(disponible: boolean): void { this.disponible = disponible; }
}
