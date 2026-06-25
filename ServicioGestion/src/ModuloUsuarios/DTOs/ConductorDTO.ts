import { Conductor } from "../Dominio/Conductor";

export class ConductorDTO {
  id: string;
  cedula: string;
  nombre: string;
  rol: string;
  email: string | null;

  constructor(id: string, cedula: string, nombre: string, email?: string | null) {
    this.id = id;
    this.cedula = cedula;
    this.nombre = nombre;
    this.rol = "Conductor";
    this.email = email ?? null;
  }

  static fromEntity(entidad: Conductor): ConductorDTO {
    return new ConductorDTO(
      entidad.obtenerId(),
      entidad.obtenerCedula(),
      entidad.obtenerNombre(),
      entidad.obtenerEmail()
    );
  }

  toEntity(): Conductor {
    return new Conductor(this.id, this.cedula, this.nombre, this.email);
  }
}
