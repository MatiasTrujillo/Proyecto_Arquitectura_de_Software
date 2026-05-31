import { Incidente } from "../Dominio/Incidente";

export class IncidenteDTO {
  id: string;
  descripcion: string;
  fecha: Date;
  reservaId: string;
  estado: string;
  severidad: string;

  constructor(
    id: string,
    descripcion: string,
    fecha: Date,
    reservaId: string,
    estado: string,
    severidad: string
  ) {
    this.id = id;
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.reservaId = reservaId;
    this.estado = estado;
    this.severidad = severidad;
  }

  static fromEntity(entidad: Incidente): IncidenteDTO {
    return new IncidenteDTO(
      entidad.getId(),
      entidad.getDescripcion(),
      entidad.getFecha(),
      entidad.getReservaId(),
      entidad.getEstado(),
      entidad.getSeveridad()
    );
  }

  toEntity(): Incidente {
    return new Incidente(
      this.id,
      this.descripcion,
      this.fecha,
      this.reservaId,
      this.estado,
      this.severidad
    );
  }
}
