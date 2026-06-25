export class Producto {
  private id: number;
  private nombre: string;

  constructor(id: number, nombre: string) {
    this.id = id;
    this.nombre = nombre;
  }

  obtenerId(): number { return this.id; }
  obtenerNombre(): string { return this.nombre; }
}
