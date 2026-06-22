import { ReglaCategoria } from "../Dominio/ReglaCategoria";

export class ReglaDTO {
  id: number;
  categoriaId: number;
  categoriaNombre: string;
  categoriaNombreEs: string;
  requiereMonitoreo: boolean;
  generaAlertas: boolean;
  recargoPorcentaje: number;

  constructor(
    id: number, categoriaId: number,
    categoriaNombre: string, categoriaNombreEs: string,
    requiereMonitoreo: boolean, generaAlertas: boolean, recargoPorcentaje: number
  ) {
    this.id = id;
    this.categoriaId = categoriaId;
    this.categoriaNombre = categoriaNombre;
    this.categoriaNombreEs = categoriaNombreEs;
    this.requiereMonitoreo = requiereMonitoreo;
    this.generaAlertas = generaAlertas;
    this.recargoPorcentaje = recargoPorcentaje;
  }
}
