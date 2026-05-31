import { ProductoDTO } from "../DTOs/ProductoDTO";

export interface IServicioProducto {
  crearProducto(descripcion: string, valor: number, tamano: number, categoria: string): ProductoDTO;
  obtenerProductos(): ProductoDTO[];
  obtenerProductoPorId(id: number): ProductoDTO;
  actualizarProducto(id: number, descripcion: string, valor: number, tamano: number, categoria: string): ProductoDTO;
  eliminarProducto(id: number): void;
}
