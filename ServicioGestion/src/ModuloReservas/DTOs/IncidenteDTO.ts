import { Incidente } from "../Dominio/Incidente";

export class IncidenteDTO {
  id: string;
  descripcion: string;
  fecha: Date;
  reservaId: string;
  estado: string;
  severidad: string;
  conductorId: string;

  constructor(id: string, descripcion: string, fecha: Date, reservaId: string, estado: string, severidad: string, conductorId: string) {
    this.id = id;
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.reservaId = reservaId;
    this.estado = estado;
    this.severidad = severidad;
    this.conductorId = conductorId;
  }

  static fromEntity(entidad: Incidente): IncidenteDTO {
    return new IncidenteDTO(
      entidad.obtenerId(),
      entidad.obtenerDescripcion(),
      entidad.obtenerFecha(),
      entidad.obtenerReservaId(),
      entidad.obtenerEstado(),
      entidad.obtenerSeveridad(),
      entidad.obtenerConductorId()
    );
  }
}
