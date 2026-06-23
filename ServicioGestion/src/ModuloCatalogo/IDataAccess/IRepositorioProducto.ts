import { Producto } from "../Dominio/Producto";

export interface IRepositorioProducto {
  crearProducto(nombre: string): Promise<Producto>;
  obtenerProductos(): Promise<Producto[]>;
  obtenerProductoPorId(id: number): Promise<Producto | undefined>;
  actualizarProducto(id: number, nombre: string): Promise<Producto | undefined>;
  eliminarProducto(id: number): Promise<boolean>;
  existe(id: number): Promise<boolean>;
}
