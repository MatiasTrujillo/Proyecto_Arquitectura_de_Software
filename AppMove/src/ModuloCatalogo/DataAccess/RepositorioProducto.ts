import { Producto } from "../Dominio/Producto";
import { ProductoId } from "../Dominio/ProductoId";
import { ProductoDescripcion } from "../Dominio/ProductoDescripcion";
import { ProductoValor } from "../Dominio/ProductoValor";
import { ProductoTamano } from "../Dominio/ProductoTamano";
import { ProductoCategoria } from "../Dominio/ProductoCategoria";
import { IRepositorioProducto } from "../IDataAccess/IRepositorioProducto";

export class RepositorioProducto implements IRepositorioProducto {
  private productos: Producto[] = [];
  private proximoId: number = 1;

  crearProducto(
    descripcion: ProductoDescripcion,
    valor: ProductoValor,
    tamano: ProductoTamano,
    categoria: ProductoCategoria
  ): Producto {
    const nuevoProducto = new Producto(
      new ProductoId(this.proximoId++),
      descripcion,
      valor,
      tamano,
      categoria
    );
    this.productos.push(nuevoProducto);
    return nuevoProducto;
  }

  obtenerProductos(): Producto[] {
    return this.productos;
  }

  obtenerProductoPorId(id: number): Producto | undefined {
    return this.productos.find(producto => producto.getId() === id);
  }

  actualizarProducto(
    id: number,
    descripcion: ProductoDescripcion,
    valor: ProductoValor,
    tamano: ProductoTamano,
    categoria: ProductoCategoria
  ): Producto | undefined {
    const index = this.productos.findIndex(producto => producto.getId() === id);

    if (index === -1) {
      return undefined;
    }

    const productoActualizado = new Producto(
      new ProductoId(id),
      descripcion,
      valor,
      tamano,
      categoria
    );
    this.productos[index] = productoActualizado;
    return productoActualizado;
  }

  eliminarProducto(id: number): boolean {
    const index = this.productos.findIndex(producto => producto.getId() === id);

    if (index === -1) {
      return false;
    }

    this.productos.splice(index, 1);
    return true;
  }

  existe(id: number): boolean {
    return this.productos.some(producto => producto.getId() === id);
  }
}
