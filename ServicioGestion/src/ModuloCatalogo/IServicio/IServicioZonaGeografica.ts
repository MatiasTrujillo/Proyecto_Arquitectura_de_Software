import { ZonaGeograficaDTO } from "../DTOs/ZonaGeograficaDTO";

export interface IServicioZonaGeografica {
  crearZona(nombre: string, delimitacionGeografica: string, tipo: string): Promise<ZonaGeograficaDTO>;
  obtenerZonas(): Promise<ZonaGeograficaDTO[]>;
  obtenerZonaPorId(id: string): Promise<ZonaGeograficaDTO>;
  actualizarZona(id: string, nombre: string, delimitacionGeografica: string, tipo: string): Promise<ZonaGeograficaDTO>;
  eliminarZona(id: string): Promise<void>;
}
