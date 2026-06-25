import { Administrador } from "../Dominio/Administrador";

export class AdministradorDTO {
  id: string;
  cedula: string;
  nombre: string;
  rol: string;

  constructor(id: string, cedula: string, nombre: string) {
    this.id = id;
    this.cedula = cedula;
    this.nombre = nombre;
    this.rol = "Administrador";
  }

  static fromEntity(entidad: Administrador): AdministradorDTO {
    return new AdministradorDTO(
      entidad.obtenerId(),
      entidad.obtenerCedula(),
      entidad.obtenerNombre()
    );
  }

  toEntity(): Administrador {
    return new Administrador(this.id, this.cedula, this.nombre);
  }
}
