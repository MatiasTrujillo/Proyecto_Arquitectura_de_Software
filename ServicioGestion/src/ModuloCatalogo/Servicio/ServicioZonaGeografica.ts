import { ZonaGeograficaDTO } from "../DTOs/ZonaGeograficaDTO";
import { IRepositorioZonaGeografica } from "../IDataAccess/IRepositorioZonaGeografica";
import { IServicioZonaGeografica } from "../IServicio/IServicioZonaGeografica";

export class ServicioZonaGeografica implements IServicioZonaGeografica {
  constructor(private repositorio: IRepositorioZonaGeografica) {}

  async crearZona(nombre: string, delimitacionGeografica: string, tipo: string): Promise<ZonaGeograficaDTO> {
    if (!nombre?.trim()) throw new Error("Nombre inválido.");
    if (!delimitacionGeografica?.trim()) throw new Error("Delimitación geográfica inválida.");
    const tiposValidos = ['regular', 'roja', 'geocerca'];
    if (!tiposValidos.includes(tipo)) throw new Error(`Tipo inválido. Debe ser: ${tiposValidos.join(', ')}`);
    const zona = await this.repositorio.crearZona(nombre.trim(), delimitacionGeografica.trim(), tipo);
    return ZonaGeograficaDTO.fromEntity(zona);
  }

  async obtenerZonas(): Promise<ZonaGeograficaDTO[]> {
    const zonas = await this.repositorio.obtenerZonas();
    return zonas.map(z => ZonaGeograficaDTO.fromEntity(z));
  }

  async obtenerZonaPorId(id: string): Promise<ZonaGeograficaDTO> {
    if (!id?.trim()) throw new Error("Id inválido.");
    const zona = await this.repositorio.obtenerZonaPorId(id);
    if (!zona) throw new Error(`No se encontró la zona con id ${id}`);
    return ZonaGeograficaDTO.fromEntity(zona);
  }

  async actualizarZona(id: string, nombre: string, delimitacionGeografica: string, tipo: string): Promise<ZonaGeograficaDTO> {
    if (!id?.trim()) throw new Error("Id inválido.");
    if (!await this.repositorio.existe(id)) throw new Error(`No se encontró la zona con id ${id}`);
    if (!nombre?.trim()) throw new Error("Nombre inválido.");
    if (!delimitacionGeografica?.trim()) throw new Error("Delimitación geográfica inválida.");
    const tiposValidos = ['regular', 'roja', 'geocerca'];
    if (!tiposValidos.includes(tipo)) throw new Error(`Tipo inválido. Debe ser: ${tiposValidos.join(', ')}`);
    const actualizada = await this.repositorio.actualizarZona(id, nombre.trim(), delimitacionGeografica.trim(), tipo);
    if (!actualizada) throw new Error(`No se pudo actualizar la zona con id ${id}`);
    return ZonaGeograficaDTO.fromEntity(actualizada);
  }

  async eliminarZona(id: string): Promise<void> {
    if (!id?.trim()) throw new Error("Id inválido.");
    if (!await this.repositorio.eliminarZona(id)) throw new Error(`No se encontró la zona con id ${id}`);
  }
}
