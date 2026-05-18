import { Producto } from "../Dominio/Producto";

export interface IServicioProducto {
  crearProducto(descripcion: string, valor: number, tamano: number, categoria: string): Producto;
  obtenerProductos(): Producto[];
  obtenerProductoPorId(id: number): Producto;
  actualizarProducto(id: number, descripcion: string, valor: number, tamano: number, categoria: string): Producto;
  eliminarProducto(id: number): void;
}
