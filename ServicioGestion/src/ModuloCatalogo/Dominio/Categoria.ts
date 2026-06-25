export class Categoria {
  private id: number;
  private nombre : string;
  private nombreEs : string;
  private descripcion : string;

  constructor(id: number, nombre:string, nombreEs:string, descripcion:string) {
    this.id = id;
    this.nombre = nombre;
    this.nombreEs = nombreEs;
    this.descripcion = descripcion;
  }

  obtenerId(): number {
    return this.id;
  }

  obtenerNombre(): string {
    return this.nombre;
  }

  obtenerNombreEs(): string {
    return this.nombreEs;
  }

  obtenerDescripcion(): string {
    return this.descripcion;
  }
}