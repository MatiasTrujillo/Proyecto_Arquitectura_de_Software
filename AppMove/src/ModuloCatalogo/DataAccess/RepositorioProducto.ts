import { Producto } from "../Dominio/Producto";
import { IRepositorioProducto } from "../IDataAccess/IRepositorioProducto";

export class RepositorioProducto implements IRepositorioProducto {
  private productos: Producto[] = [];
  private proximoId: number = 1;

  crearProducto(descripcion: string, valor: number, tamano: number, categoria: string): Producto {
    const nuevoProducto = new Producto(this.proximoId++, descripcion, valor, tamano, categoria);
    this.productos.push(nuevoProducto);
    return nuevoProducto;
  }

  obtenerProductos(): Producto[] {
    return this.productos;
  }

  obtenerProductoPorId(id: number): Producto | undefined {
    return this.productos.find(producto => producto.getId() === id);
  }

  actualizarProducto(id: number, descripcion: string, valor: number, tamano: number, categoria: string): Producto | undefined {
    const index = this.productos.findIndex(producto => producto.getId() === id);
    const productoActualizado = new Producto(id, descripcion, valor, tamano, categoria);
    this.productos[index] = productoActualizado;
    return productoActualizado;
  }

  eliminarProducto(id: number): boolean {
    const index = this.productos.findIndex(producto => producto.getId() === id);
    this.productos.splice(index, 1);
    return true;
  }

  existe(id: number): boolean {
    return this.productos.some(producto => producto.getId() === id);
  }
}
