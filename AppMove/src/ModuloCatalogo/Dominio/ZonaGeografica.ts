export class Categoria {
  private id: number;
  private nombre : string;
  private delimitacionGeografica: string //no se que es esto

  constructor(id: number, nombre:string, delimitacionGeografica:string) {
    this.id = id;
    this.nombre = nombre;
    this.delimitacionGeografica = delimitacionGeografica;
  }

  getId(): number {
    return this.id;
  }

  getNombre(): string {
    return this.nombre;
  }

  getNombreEs(): string {
    return this.delimitacionGeografica;
  }
}