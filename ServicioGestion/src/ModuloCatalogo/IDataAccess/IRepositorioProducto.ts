import { Producto } from "../Dominio/Producto";

export interface IRepositorioProducto {
  crearProducto(descripcion: string, valor: number | null, tamano: number, categoria: string): Promise<Producto>;
  obtenerProductos(): Promise<Producto[]>;
  obtenerProductoPorId(id: number): Promise<Producto | undefined>;
  actualizarProducto(id: number, descripcion: string, valor: number | null, tamano: number, categoria: string): Promise<Producto | undefined>;
  eliminarProducto(id: number): Promise<boolean>;
  existe(id: number): Promise<boolean>;
}
