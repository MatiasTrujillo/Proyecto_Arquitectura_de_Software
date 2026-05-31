import { Categoria } from "../Dominio/Categoria";

export class CategoriaDTO {
  id: number;
  nombre: string;
  nombreEs: string;
  descripcion: string;

  constructor(id: number, nombre: string, nombreEs: string, descripcion: string) {
    this.id = id;
    this.nombre = nombre;
    this.nombreEs = nombreEs;
    this.descripcion = descripcion;
  }

  static fromEntity(entidad: Categoria): CategoriaDTO {
    return new CategoriaDTO(
      entidad.getId(),
      entidad.getNombre(),
      entidad.getNombreEs(),
      entidad.getDescripcion()
    );
  }

  toEntity(): Categoria {
    return new Categoria(this.id, this.nombre, this.nombreEs, this.descripcion);
  }
}
