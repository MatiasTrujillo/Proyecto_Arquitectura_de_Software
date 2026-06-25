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

  obtenerId(): number { return this.id; }
  obtenerMatricula(): string { return this.matricula; }
  obtenerTipo(): string { return this.tipo; }
  obtenerCapacidad(): number { return this.capacidad; }
  obtenerDispositivoGps(): string { return this.dispositivoGps; }
  obtenerCaracteristicas(): string[] { return this.caracteristicas; }
}
