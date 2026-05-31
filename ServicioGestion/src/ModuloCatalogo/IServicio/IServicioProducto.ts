import { ProductoDTO } from "../DTOs/ProductoDTO";

export interface IServicioProducto {
  crearProducto(descripcion: string, valor: number, tamano: number, categoria: string): Promise<ProductoDTO>;
  obtenerProductos(): Promise<ProductoDTO[]>;
  obtenerProductoPorId(id: number): Promise<ProductoDTO>;
  actualizarProducto(id: number, descripcion: string, valor: number, tamano: number, categoria: string): Promise<ProductoDTO>;
  eliminarProducto(id: number): Promise<void>;
}
