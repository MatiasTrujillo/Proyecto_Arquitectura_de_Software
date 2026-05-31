import { IncidenteDTO } from "../DTOs/IncidenteDTO";
import { IRepositorioIncidente } from "../IDataAccess/IRepositorioIncidente";
import { IServicioIncidente } from "../IServicio/IServicioIncidente";

export class ServicioIncidente implements IServicioIncidente {
  constructor(private repositorio: IRepositorioIncidente) {}

  async crearIncidente(
    descripcion: string,
    fecha: string | Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ): Promise<IncidenteDTO> {
    const descripcionValida = this.validarDescripcion(descripcion);
    const fechaValida = this.validarFecha(fecha);
    const reservaIdValido = this.validarId(reservaId);
    const estadoValido = this.validarEstado(estado);
    const severidadValida = this.validarSeveridad(severidad);

    const incidente = await this.repositorio.crearIncidente(
      descripcionValida,
      fechaValida,
      reservaIdValido,
      estadoValido,
      severidadValida,
    );

    return IncidenteDTO.fromEntity(incidente);
  }

  async obtenerIncidentes(): Promise<IncidenteDTO[]> {
    const incidentes = await this.repositorio.obtenerIncidentes();
    return incidentes.map(incidente => IncidenteDTO.fromEntity(incidente));
  }

  async obtenerIncidentePorId(id: string): Promise<IncidenteDTO> {
    const idValido = this.validarId(id);
    const incidente = await this.repositorio.obtenerIncidentePorId(idValido);

    if (!incidente) {
      throw new Error(`No se encontró el incidente con id ${idValido}`);
    }

    return IncidenteDTO.fromEntity(incidente);
  }

  async actualizarIncidente(
    id: string,
    descripcion: string,
    fecha: string | Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ): Promise<IncidenteDTO> {
    const idValido = this.validarId(id);
    const descripcionValida = this.validarDescripcion(descripcion);
    const fechaValida = this.validarFecha(fecha);
    const reservaIdValido = this.validarId(reservaId);
    const estadoValido = this.validarEstado(estado);
    const severidadValida = this.validarSeveridad(severidad);

    if (!await this.repositorio.existe(idValido)) {
      throw new Error(`No se encontró el incidente con id ${idValido}`);
    }

    const incidenteActualizado = await this.repositorio.actualizarIncidente(
      idValido,
      descripcionValida,
      fechaValida,
      reservaIdValido,
      estadoValido,
      severidadValida,
    );

    if (!incidenteActualizado) {
      throw new Error(`No se pudo actualizar el incidente con id ${idValido}`);
    }

    return IncidenteDTO.fromEntity(incidenteActualizado);
  }

  async eliminarIncidente(id: string): Promise<void> {
    const idValido = this.validarId(id);

    if (!await this.repositorio.eliminarIncidente(idValido)) {
      throw new Error(`No se encontró el incidente con id ${idValido}`);
    }
  }

  private validarDescripcion(descripcion: string): string {
    if (!descripcion || descripcion.trim().length === 0) {
      throw new Error("Descripción inválida. Debe contener texto.");
    }
    return descripcion.trim();
  }

  private validarFecha(fecha: string | Date): Date {
    const valor = fecha instanceof Date ? fecha : new Date(fecha);
    if (Number.isNaN(valor.getTime())) {
      throw new Error("Fecha inválida.");
    }
    return valor;
  }

  private validarId(id: string): string {
    if (!id || id.trim().length === 0) {
      throw new Error("Id inválido.");
    }
    return id.trim();
  }

  private validarEstado(estado: string): string {
    if (!estado || estado.trim().length === 0) {
      throw new Error("Estado inválido.");
    }
    return estado.trim();
  }

  private validarSeveridad(severidad: string): string {
    if (!severidad || severidad.trim().length === 0) {
      throw new Error("Severidad inválida.");
    }
    return severidad.trim();
  }
}
