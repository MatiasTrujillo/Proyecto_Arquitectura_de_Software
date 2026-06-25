import { Producto } from "../Dominio/Producto";

export class ProductoDTO {
  id: number;
  nombre: string;

  constructor(id: number, nombre: string) {
    this.id = id;
    this.nombre = nombre;
  }

  static fromEntity(entidad: Producto): ProductoDTO {
    return new ProductoDTO(entidad.obtenerId(), entidad.obtenerNombre());
  }

  toEntity(): Producto {
    return new Producto(this.id, this.nombre);
  }
}
