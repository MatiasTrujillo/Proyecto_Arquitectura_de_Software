import { DispositivoGPS } from "../Domain/DispositivoGPS";

export class DispositivoGPSDTO {
  id: number;
  ubicacion: string;

  constructor(id: number, ubicacion: string = '') {
    this.id = id;
    this.ubicacion = ubicacion;
  }

  static fromEntity(entidad: DispositivoGPS): DispositivoGPSDTO {
    return new DispositivoGPSDTO(entidad.getId(), entidad.getUbicacion());
  }

  toEntity(): DispositivoGPS {
    return new DispositivoGPS(this.id, this.ubicacion);
  }
}
