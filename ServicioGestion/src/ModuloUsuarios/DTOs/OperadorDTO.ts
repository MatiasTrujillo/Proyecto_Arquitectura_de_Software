import { Operador } from "../Dominio/Operador";

export class OperadorDTO {
  id: string;
  cedula: string;
  nombre: string;
  rol: string;
  email: string | null;

  constructor(id: string, cedula: string, nombre: string, email?: string | null) {
    this.id = id;
    this.cedula = cedula;
    this.nombre = nombre;
    this.rol = "Operador";
    this.email = email ?? null;
  }

  static fromEntity(entidad: Operador): OperadorDTO {
    return new OperadorDTO(
      entidad.obtenerId(),
      entidad.obtenerCedula(),
      entidad.obtenerNombre(),
      entidad.obtenerEmail()
    );
  }

  toEntity(): Operador {
    return new Operador(this.id, this.cedula, this.nombre, this.email);
  }
}
