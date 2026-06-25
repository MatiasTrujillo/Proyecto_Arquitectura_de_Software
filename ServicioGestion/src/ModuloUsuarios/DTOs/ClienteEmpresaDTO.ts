import { ClienteEmpresa } from "../Dominio/ClienteEmpresa";

export class ClienteEmpresaDTO {
  id: string;
  cedula: string;
  nombre: string;
  rol: string;
  email: string | null;

  constructor(id: string, cedula: string, nombre: string, email?: string | null) {
    this.id = id;
    this.cedula = cedula;
    this.nombre = nombre;
    this.rol = "ClienteEmpresa";
    this.email = email ?? null;
  }

  static fromEntity(entidad: ClienteEmpresa): ClienteEmpresaDTO {
    return new ClienteEmpresaDTO(
      entidad.obtenerId(),
      entidad.obtenerCedula(),
      entidad.obtenerNombre(),
      entidad.obtenerEmail()
    );
  }

  toEntity(): ClienteEmpresa {
    return new ClienteEmpresa(this.id, this.cedula, this.nombre, this.email);
  }
}
