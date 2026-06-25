import { ClienteEmpresa } from "../Dominio/ClienteEmpresa";

export class ClienteEmpresaDTO {
  id: string;
  cedula: string;
  nombre: string;
  rol: string;

  constructor(id: string, cedula: string, nombre: string) {
    this.id = id;
    this.cedula = cedula;
    this.nombre = nombre;
    this.rol = "ClienteEmpresa";
  }

  static fromEntity(entidad: ClienteEmpresa): ClienteEmpresaDTO {
    return new ClienteEmpresaDTO(
      entidad.obtenerId(),
      entidad.obtenerCedula(),
      entidad.obtenerNombre()
    );
  }

  toEntity(): ClienteEmpresa {
    return new ClienteEmpresa(this.id, this.cedula, this.nombre);
  }
}
