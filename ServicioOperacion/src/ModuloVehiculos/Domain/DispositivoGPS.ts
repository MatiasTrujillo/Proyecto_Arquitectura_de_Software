export class DispositivoGPS {
  private id: number;
  private nombre: string;

  constructor(id: number, nombre: string = '') {
    this.id = id;
    this.nombre = nombre;
  }

  obtenerId(): number {
    return this.id;
  }

  obtenerNombre(): string {
    return this.nombre;
  }

  asignarNombre(nombre: string): void {
    this.nombre = nombre;
  }
}
