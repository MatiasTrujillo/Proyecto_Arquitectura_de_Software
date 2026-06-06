export class DispositivoGPS {
  private id: number;
  private ubicacion: string;

  constructor(id: number, ubicacion: string = '') {
    this.id = id;
    this.ubicacion = ubicacion;
  }

  getId(): number {
    return this.id;
  }

  getUbicacion(): string {
    return this.ubicacion;
  }

  setUbicacion(ubicacion: string): void {
    this.ubicacion = ubicacion;
  }
}