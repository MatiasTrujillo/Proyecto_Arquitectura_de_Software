import { ProductoDTO } from "../DTOs/ProductoDTO";

export interface IServicioProducto {
  crearProducto(nombre: string): Promise<ProductoDTO>;
  obtenerProductos(): Promise<ProductoDTO[]>;
  obtenerProductoPorId(id: number): Promise<ProductoDTO>;
  actualizarProducto(id: number, nombre: string): Promise<ProductoDTO>;
  eliminarProducto(id: number): Promise<void>;
}
