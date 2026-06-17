import { IncidenteDTO } from "../DTOs/IncidenteDTO";
import { IRepositorioIncidente } from "../IDataAccess/IRepositorioIncidente";
import { IServicioIncidente } from "../IServicio/IServicioIncidente";

export class ServicioIncidente implements IServicioIncidente {
  constructor(private repositorio: IRepositorioIncidente) {}

  async crearIncidente(descripcion: string, fecha: string | Date, reservaId: string, estado: string, severidad: string, conductorId: string): Promise<IncidenteDTO> {
    const incidente = await this.repositorio.crearIncidente(
      this.validarDescripcion(descripcion),
      this.validarFecha(fecha),
      this.validarId(reservaId),
      this.validarEstado(estado),
      this.validarSeveridad(severidad),
      conductorId ?? ''
    );
    return IncidenteDTO.fromEntity(incidente);
  }

  async obtenerIncidentes(): Promise<IncidenteDTO[]> {
    const incidentes = await this.repositorio.obtenerIncidentes();
    return incidentes.map(i => IncidenteDTO.fromEntity(i));
  }

  async obtenerIncidentePorId(id: string): Promise<IncidenteDTO> {
    const incidente = await this.repositorio.obtenerIncidentePorId(this.validarId(id));
    if (!incidente) throw new Error(`No se encontró el incidente con id ${id}`);
    return IncidenteDTO.fromEntity(incidente);
  }

  async actualizarIncidente(id: string, descripcion: string, fecha: string | Date, reservaId: string, estado: string, severidad: string, conductorId: string): Promise<IncidenteDTO> {
    const idValido = this.validarId(id);
    if (!await this.repositorio.existe(idValido)) throw new Error(`No se encontró el incidente con id ${idValido}`);
    const actualizado = await this.repositorio.actualizarIncidente(
      idValido,
      this.validarDescripcion(descripcion),
      this.validarFecha(fecha),
      this.validarId(reservaId),
      this.validarEstado(estado),
      this.validarSeveridad(severidad),
      conductorId ?? ''
    );
    if (!actualizado) throw new Error(`No se pudo actualizar el incidente con id ${idValido}`);
    return IncidenteDTO.fromEntity(actualizado);
  }

  async eliminarIncidente(id: string): Promise<void> {
    if (!await this.repositorio.eliminarIncidente(this.validarId(id))) throw new Error(`No se encontró el incidente con id ${id}`);
  }

  private validarDescripcion(descripcion: string): string {
    if (!descripcion?.trim()) throw new Error("Descripción inválida. Debe contener texto.");
    return descripcion.trim();
  }

  private validarFecha(fecha: string | Date): Date {
    const valor = fecha instanceof Date ? fecha : new Date(fecha);
    if (Number.isNaN(valor.getTime())) throw new Error("Fecha inválida.");
    return valor;
  }

  private validarId(id: string): string {
    if (!id?.trim()) throw new Error("Id inválido.");
    return id.trim();
  }

  private validarEstado(estado: string): string {
    if (!estado?.trim()) throw new Error("Estado inválido.");
    return estado.trim();
  }

  private validarSeveridad(severidad: string): string {
    if (!severidad?.trim()) throw new Error("Severidad inválida.");
    return severidad.trim();
  }
}
