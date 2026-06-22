import { DispositivoGPS } from "../Domain/DispositivoGPS";

export class DispositivoGPSDTO {
  id: number;
  nombre: string;

  constructor(id: number, nombre: string = '') {
    this.id = id;
    this.nombre = nombre;
  }

  static fromEntity(entidad: DispositivoGPS): DispositivoGPSDTO {
    return new DispositivoGPSDTO(entidad.getId(), entidad.getNombre());
  }

  toEntity(): DispositivoGPS {
    return new DispositivoGPS(this.id, this.nombre);
  }
}
