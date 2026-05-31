import { Viaje } from "../Dominio/Viaje";

export class ViajeDTO {
  id: string;
  reservaId: string;
  origen: string;
  destino: string;
  fecha: Date;
  estado: string;
  conductor: string;

  constructor(
    id: string,
    reservaId: string,
    origen: string,
    destino: string,
    fecha: Date,
    estado: string,
    conductor: string
  ) {
    this.id = id;
    this.reservaId = reservaId;
    this.origen = origen;
    this.destino = destino;
    this.fecha = fecha;
    this.estado = estado;
    this.conductor = conductor;
  }

  static fromEntity(entidad: Viaje): ViajeDTO {
    return new ViajeDTO(
      entidad.getId(),
      entidad.getReservaId(),
      entidad.getOrigen(),
      entidad.getDestino(),
      entidad.getFecha(),
      entidad.getEstado(),
      entidad.getConductor()
    );
  }

  toEntity(): Viaje {
    return new Viaje(
      this.id,
      this.reservaId,
      this.origen,
      this.destino,
      this.fecha,
      this.estado,
      this.conductor
    );
  }
}
