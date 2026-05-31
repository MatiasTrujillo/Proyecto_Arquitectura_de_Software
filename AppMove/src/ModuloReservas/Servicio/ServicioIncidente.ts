import { IncidenteDTO } from "../DTOs/IncidenteDTO";
import { IRepositorioIncidente } from "../IDataAccess/IRepositorioIncidente";
import { IServicioIncidente } from "../IServicio/IServicioIncidente";

export class ServicioIncidente implements IServicioIncidente {
  constructor(private repositorio: IRepositorioIncidente) {}

  crearIncidente(
    descripcion: string,
    fecha: string | Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ): IncidenteDTO {
    const descripcionValida = this.validarDescripcion(descripcion);
    const fechaValida = this.validarFecha(fecha);
    const reservaIdValido = this.validarId(reservaId);
    const estadoValido = this.validarEstado(estado);
    const severidadValida = this.validarSeveridad(severidad);

    const incidente = this.repositorio.crearIncidente(
      descripcionValida,
      fechaValida,
      reservaIdValido,
      estadoValido,
      severidadValida,
    );

    return IncidenteDTO.fromEntity(incidente);
  }

  obtenerIncidentes(): IncidenteDTO[] {
    const incidentes = this.repositorio.obtenerIncidentes();
    return incidentes.map(incidente => IncidenteDTO.fromEntity(incidente));
  }

  obtenerIncidentePorId(id: string): IncidenteDTO {
    const idValido = this.validarId(id);
    const incidente = this.repositorio.obtenerIncidentePorId(idValido);

    if (!incidente) {
      throw new Error(`No se encontró el incidente con id ${idValido}`);
    }

    return IncidenteDTO.fromEntity(incidente);
  }

  actualizarIncidente(
    id: string,
    descripcion: string,
    fecha: string | Date,
    reservaId: string,
    estado: string,
    severidad: string,
  ): IncidenteDTO {
    const idValido = this.validarId(id);
    const descripcionValida = this.validarDescripcion(descripcion);
    const fechaValida = this.validarFecha(fecha);
    const reservaIdValido = this.validarId(reservaId);
    const estadoValido = this.validarEstado(estado);
    const severidadValida = this.validarSeveridad(severidad);

    if (!this.repositorio.existe(idValido)) {
      throw new Error(`No se encontró el incidente con id ${idValido}`);
    }

    const incidenteActualizado = this.repositorio.actualizarIncidente(
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

  eliminarIncidente(id: string): void {
    const idValido = this.validarId(id);

    if (!this.repositorio.eliminarIncidente(idValido)) {
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
