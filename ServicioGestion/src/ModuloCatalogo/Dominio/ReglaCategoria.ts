export class ReglaCategoria {
  constructor(
    private id: number,
    private categoriaId: number,
    private requiereMonitoreo: boolean,
    private generaAlertas: boolean,
    private recargoPorcentaje: number
  ) {}
  obtenerId()                  { return this.id; }
  obtenerCategoriaId()         { return this.categoriaId; }
  obtenerRequiereMonitoreo()   { return this.requiereMonitoreo; }
  obtenerGeneraAlertas()       { return this.generaAlertas; }
  obtenerRecargoPorcentaje()   { return this.recargoPorcentaje; }
}
