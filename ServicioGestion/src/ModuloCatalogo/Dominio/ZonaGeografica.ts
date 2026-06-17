export class ZonaGeografica {
  constructor(
    private id: string,
    private nombre: string,
    private delimitacionGeografica: string,
    private tipo: string
  ) {}

  getId(): string { return this.id; }
  getNombre(): string { return this.nombre; }
  getDelimitacionGeografica(): string { return this.delimitacionGeografica; }
  getTipo(): string { return this.tipo; }
}
