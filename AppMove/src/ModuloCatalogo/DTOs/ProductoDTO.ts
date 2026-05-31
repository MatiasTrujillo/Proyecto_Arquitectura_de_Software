import { Producto } from "../Dominio/Producto";

export class ProductoDTO {
  id: number;
  descripcion: string;
  valor: number;
  tamano: number;
  categoria: string;

  constructor(id: number, descripcion: string, valor: number, tamano: number, categoria: string) {
    this.id = id;
    this.descripcion = descripcion;
    this.valor = valor;
    this.tamano = tamano;
    this.categoria = categoria;
  }

  static fromEntity(entidad: Producto): ProductoDTO {
    return new ProductoDTO(
      entidad.getId(),
      entidad.getDescripcion(),
      entidad.getValor(),
      entidad.getTamano(),
      entidad.getCategoria()
    );
  }

  toEntity(): Producto {
    return new Producto(this.id, this.descripcion, this.valor, this.tamano, this.categoria);
  }
}
