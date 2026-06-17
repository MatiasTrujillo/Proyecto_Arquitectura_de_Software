import { Vehiculo } from "../Dominio/Vehiculo";

export class VehiculoDTO {
  id: string;
  matricula: string;
  tipo: string;
  capacidad: number;
  dispositivoGPS: string;
  disponible: boolean;
  caracteristicas: Record<string, string>;

  constructor(
    id: string,
    matricula: string,
    tipo: string,
    capacidad: number,
    dispositivoGPS: string,
    disponible: boolean,
    caracteristicas: Record<string, string>
  ) {
    this.id = id;
    this.matricula = matricula;
    this.tipo = tipo;
    this.capacidad = capacidad;
    this.dispositivoGPS = dispositivoGPS;
    this.disponible = disponible;
    this.caracteristicas = caracteristicas;
  }

  static fromEntity(entidad: Vehiculo): VehiculoDTO {
    return new VehiculoDTO(
      entidad.getId(),
      entidad.getMatricula(),
      entidad.getTipo(),
      entidad.getCapacidad(),
      entidad.getDispositivoGPS(),
      entidad.isDisponible(),
      entidad.getCaracteristicas()
    );
  }
}
