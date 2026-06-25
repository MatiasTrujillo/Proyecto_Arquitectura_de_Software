export class ZonaGeografica {
  constructor(
    private id: string,
    private nombre: string,
    private delimitacionGeografica: string,
    private tipo: string
  ) {}

  obtenerId(): string { return this.id; }
  obtenerNombre(): string { return this.nombre; }
  obtenerDelimitacionGeografica(): string { return this.delimitacionGeografica; }
  obtenerTipo(): string { return this.tipo; }
}
