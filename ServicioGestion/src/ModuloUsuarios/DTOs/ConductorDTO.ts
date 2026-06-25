import { Conductor } from "../Dominio/Conductor";

export class ConductorDTO {
  id: string;
  cedula: string;
  nombre: string;
  rol: string;

  constructor(id: string, cedula: string, nombre: string) {
    this.id = id;
    this.cedula = cedula;
    this.nombre = nombre;
    this.rol = "Conductor";
  }

  static fromEntity(entidad: Conductor): ConductorDTO {
    return new ConductorDTO(
      entidad.obtenerId(),
      entidad.obtenerCedula(),
      entidad.obtenerNombre()
    );
  }

  toEntity(): Conductor {
    return new Conductor(this.id, this.cedula, this.nombre);
  }
}
