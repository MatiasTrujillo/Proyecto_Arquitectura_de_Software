export class ReglaCategoria {
  constructor(
    private id: number,
    private categoriaId: number,
    private requiereMonitoreo: boolean,
    private generaAlertas: boolean,
    private recargoPorcentaje: number
  ) {}
  getId()                  { return this.id; }
  getCategoriaId()         { return this.categoriaId; }
  getRequiereMonitoreo()   { return this.requiereMonitoreo; }
  getGeneraAlertas()       { return this.generaAlertas; }
  getRecargoPorcentaje()   { return this.recargoPorcentaje; }
}
