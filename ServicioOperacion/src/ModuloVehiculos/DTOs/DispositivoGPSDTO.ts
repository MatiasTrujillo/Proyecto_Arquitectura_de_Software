import { DispositivoGPS } from "../Domain/DispositivoGPS";

export class DispositivoGPSDTO {
  id: number;

  constructor(id: number) {
    this.id = id;
  }

  static fromEntity(entidad: DispositivoGPS): DispositivoGPSDTO {
    return new DispositivoGPSDTO(entidad.getId());
  }

  toEntity(): DispositivoGPS {
    return new DispositivoGPS(this.id);
  }
}
