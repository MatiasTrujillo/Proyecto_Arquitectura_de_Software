import { Producto } from "../Dominio/Producto";

export interface IRepositorioProducto {
  crearProducto(descripcion: string, valor: number, tamano: number, categoria: string): Producto;
  obtenerProductos(): Producto[];
  obtenerProductoPorId(id: number): Producto | undefined;
  actualizarProducto(id: number, descripcion: string, valor: number, tamano: number, categoria: string): Producto | undefined;
  eliminarProducto(id: number): boolean;
  existe(id: number): boolean;
}
