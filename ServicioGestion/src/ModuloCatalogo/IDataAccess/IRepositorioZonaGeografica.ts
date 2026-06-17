import { ZonaGeografica } from "../Dominio/ZonaGeografica";

export interface IRepositorioZonaGeografica {
  crearZona(nombre: string, delimitacionGeografica: string, tipo: string): Promise<ZonaGeografica>;
  obtenerZonas(): Promise<ZonaGeografica[]>;
  obtenerZonaPorId(id: string): Promise<ZonaGeografica | undefined>;
  actualizarZona(id: string, nombre: string, delimitacionGeografica: string, tipo: string): Promise<ZonaGeografica | undefined>;
  eliminarZona(id: string): Promise<boolean>;
  existe(id: string): Promise<boolean>;
}
