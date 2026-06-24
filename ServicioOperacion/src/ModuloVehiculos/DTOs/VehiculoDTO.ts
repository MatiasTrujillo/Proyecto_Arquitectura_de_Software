import { Vehiculo } from "../Domain/Vehiculo";

export class VehiculoDTO {
  id: number;
  matricula: string;
  tipo: string;
  capacidad: number;
  dispositivoGps: string;
  caracteristicas: string[];

  constructor(id: number, matricula: string, tipo: string, capacidad: number, dispositivoGps: string, caracteristicas: string[] = []) {
    this.id = id;
    this.matricula = matricula;
    this.tipo = tipo;
    this.capacidad = capacidad;
    this.dispositivoGps = dispositivoGps;
    this.caracteristicas = caracteristicas;
  }

  static fromEntity(entidad: Vehiculo): VehiculoDTO {
    return new VehiculoDTO(
      entidad.getId(),
      entidad.getMatricula(),
      entidad.getTipo(),
      entidad.getCapacidad(),
      entidad.getDispositivoGps(),
      entidad.getCaracteristicas()
    );
  }

  toEntity(): Vehiculo {
    return new Vehiculo(this.id, this.matricula, this.tipo, this.capacidad, this.dispositivoGps, this.caracteristicas);
  }
}
