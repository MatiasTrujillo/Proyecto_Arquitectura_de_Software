export class Vehiculo {
  private id: number;
  private matricula: string;
  private tipo: string;
  private capacidad: number;
  private dispositivoGps: string;
  private caracteristicas: string[];

  constructor(id: number, matricula: string, tipo: string, capacidad: number, dispositivoGps: string, caracteristicas: string[] = []) {
    this.id = id;
    this.matricula = matricula;
    this.tipo = tipo;
    this.capacidad = capacidad;
    this.dispositivoGps = dispositivoGps;
    this.caracteristicas = caracteristicas;
  }

  getId(): number { return this.id; }
  getMatricula(): string { return this.matricula; }
  getTipo(): string { return this.tipo; }
  getCapacidad(): number { return this.capacidad; }
  getDispositivoGps(): string { return this.dispositivoGps; }
  getCaracteristicas(): string[] { return this.caracteristicas; }
}
