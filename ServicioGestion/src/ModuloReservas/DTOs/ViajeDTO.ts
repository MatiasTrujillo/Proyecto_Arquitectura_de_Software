import { Viaje } from "../Dominio/Viaje";

export class ViajeDTO {
  id: string;
  reservaId: string;
  origen: string;
  destino: string;
  fecha: Date;
  estado: string;
  conductor: string;
  vehiculo: string;
  tieneAlertas: boolean;

  constructor(
    id: string,
    reservaId: string,
    origen: string,
    destino: string,
    fecha: Date,
    estado: string,
    conductor: string,
    vehiculo: string = '',
    tieneAlertas: boolean = false,
  ) {
    this.id = id;
    this.reservaId = reservaId;
    this.origen = origen;
    this.destino = destino;
    this.fecha = fecha;
    this.estado = estado;
    this.conductor = conductor;
    this.vehiculo = vehiculo;
    this.tieneAlertas = tieneAlertas;
  }

  static fromEntity(entidad: Viaje): ViajeDTO {
    return new ViajeDTO(
      entidad.obtenerId(),
      entidad.obtenerReservaId(),
      entidad.obtenerOrigen(),
      entidad.obtenerDestino(),
      entidad.obtenerFecha(),
      entidad.obtenerEstado(),
      entidad.obtenerConductor(),
      entidad.obtenerVehiculo(),
      entidad.obtenerTieneAlertas(),
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
      this.conductor,
      this.vehiculo,
      this.tieneAlertas,
    );
  }
}
