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

  getId(): number {
    return this.id;
  }

  getNombre(): string {
    return this.nombre;
  }

  getNombreEs(): string {
    return this.nombreEs;
  }

  getDescripcion(): string {
    return this.descripcion;
  }
}