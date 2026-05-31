export class Vehiculo {
  private id: number;
  private matricula: string;
  private tipo: string;
  private capacidad: number;
  private dispositivoGps: string; //DispositivoGPS

  constructor(id: number, matricula: string, tipo: string, capacidad: number, dispositivoGps: string) {
    this.id = id;
    this.matricula = matricula;
    this.tipo = tipo;
    this.capacidad = capacidad;
    this.dispositivoGps = dispositivoGps;
  }

  getId(): number {
    return this.id;
  }

  getMatricula(): string {
    return this.matricula;
  }

  getTipo(): string {
    return this.tipo;
  }

  getCapacidad(): number {
    return this.capacidad;
  }

  getDispositivoGps(): string {
    return this.dispositivoGps;
  }
}