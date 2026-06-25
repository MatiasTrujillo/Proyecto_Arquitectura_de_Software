import { Administrador } from "../Dominio/Administrador";

export class AdministradorDTO {
  id: string;
  cedula: string;
  nombre: string;
  rol: string;
  email: string | null;

  constructor(id: string, cedula: string, nombre: string, email?: string | null) {
    this.id = id;
    this.cedula = cedula;
    this.nombre = nombre;
    this.rol = "Administrador";
    this.email = email ?? null;
  }

  static fromEntity(entidad: Administrador): AdministradorDTO {
    return new AdministradorDTO(
      entidad.obtenerId(),
      entidad.obtenerCedula(),
      entidad.obtenerNombre(),
      entidad.obtenerEmail()
    );
  }

  toEntity(): Administrador {
    return new Administrador(this.id, this.cedula, this.nombre, this.email);
  }
}
