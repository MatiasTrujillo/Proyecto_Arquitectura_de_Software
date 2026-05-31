import { Operador } from "../Dominio/Operador";

export class OperadorDTO {
  id: string;
  cedula: string;
  nombre: string;
  rol: string;

  constructor(id: string, cedula: string, nombre: string) {
    this.id = id;
    this.cedula = cedula;
    this.nombre = nombre;
    this.rol = "Operador";
  }

  static fromEntity(entidad: Operador): OperadorDTO {
    return new OperadorDTO(
      entidad.getId(),
      entidad.getCedula(),
      entidad.getNombre()
    );
  }

  toEntity(): Operador {
    return new Operador(this.id, this.cedula, this.nombre);
  }
}
