import { ClientePersonal } from "../Dominio/ClientePersonal";

export class ClientePersonalDTO {
  id: string;
  cedula: string;
  nombre: string;
  rol: string;
  email: string | null;

  constructor(id: string, cedula: string, nombre: string, email?: string | null) {
    this.id = id;
    this.cedula = cedula;
    this.nombre = nombre;
    this.rol = "ClientePersonal";
    this.email = email ?? null;
  }

  static fromEntity(entidad: ClientePersonal): ClientePersonalDTO {
    return new ClientePersonalDTO(
      entidad.obtenerId(),
      entidad.obtenerCedula(),
      entidad.obtenerNombre(),
      entidad.obtenerEmail()
    );
  }

  toEntity(): ClientePersonal {
    return new ClientePersonal(this.id, this.cedula, this.nombre, this.email);
  }
}
