import { ClientePersonal } from "../Dominio/ClientePersonal";

export class ClientePersonalDTO {
  id: string;
  cedula: string;
  nombre: string;
  rol: string;

  constructor(id: string, cedula: string, nombre: string) {
    this.id = id;
    this.cedula = cedula;
    this.nombre = nombre;
    this.rol = "ClientePersonal";
  }

  static fromEntity(entidad: ClientePersonal): ClientePersonalDTO {
    return new ClientePersonalDTO(
      entidad.getId(),
      entidad.getCedula(),
      entidad.getNombre()
    );
  }

  toEntity(): ClientePersonal {
    return new ClientePersonal(this.id, this.cedula, this.nombre);
  }
}
