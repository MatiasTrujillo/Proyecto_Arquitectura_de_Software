import { Vehiculo } from "../Domain/Vehiculo";

export class VehiculoDTO {
  id: number;
  matricula: string;
  tipo: string;
  capacidad: number;
  dispositivoGps: string;

  constructor(id: number, matricula: string, tipo: string, capacidad: number, dispositivoGps: string) {
    this.id = id;
    this.matricula = matricula;
    this.tipo = tipo;
    this.capacidad = capacidad;
    this.dispositivoGps = dispositivoGps;
  }

  static fromEntity(entidad: Vehiculo): VehiculoDTO {
    return new VehiculoDTO(
      entidad.getId(),
      entidad.getMatricula(),
      entidad.getTipo(),
      entidad.getCapacidad(),
      entidad.getDispositivoGps()
    );
  }

  toEntity(): Vehiculo {
    return new Vehiculo(this.id, this.matricula, this.tipo, this.capacidad, this.dispositivoGps);
  }
}
