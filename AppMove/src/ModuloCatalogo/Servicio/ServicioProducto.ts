import { Producto } from "../Dominio/Producto";
import { ProductoDescripcion } from "../Dominio/ProductoDescripcion";
import { ProductoValor } from "../Dominio/ProductoValor";
import { ProductoTamano } from "../Dominio/ProductoTamano";
import { ProductoCategoria } from "../Dominio/ProductoCategoria";
import { IRepositorioProducto } from "../IDataAccess/IRepositorioProducto";
import { IServicioProducto } from "../IServicio/IServicioProducto";

export class ServicioProducto implements IServicioProducto {
  constructor(private repositorio: IRepositorioProducto) {}

  crearProducto(descripcion: string, valor: number, tamano: number, categoria: string): Producto {
    const descripcionVo = new ProductoDescripcion(descripcion);
    const valorVo = new ProductoValor(valor);
    const tamanoVo = new ProductoTamano(tamano);
    const categoriaVo = new ProductoCategoria(categoria);

    return this.repositorio.crearProducto(descripcionVo, valorVo, tamanoVo, categoriaVo);
  }

  obtenerProductos(): Producto[] {
    return this.repositorio.obtenerProductos();
  }

  obtenerProductoPorId(id: number): Producto {
    const idValido = this.validarId(id);
    const producto = this.repositorio.obtenerProductoPorId(idValido);

    if (!producto) {
      throw new Error(`No se encontró el producto con id ${idValido}`);
    }

    return producto;
  }

  actualizarProducto(id: number, descripcion: string, valor: number, tamano: number, categoria: string): Producto {
    const idValido = this.validarId(id);
    const descripcionVo = new ProductoDescripcion(descripcion);
    const valorVo = new ProductoValor(valor);
    const tamanoVo = new ProductoTamano(tamano);
    const categoriaVo = new ProductoCategoria(categoria);

    if (!this.repositorio.existe(idValido)) {
      throw new Error(`No se encontró el producto con id ${idValido}`);
    }

    const productoActualizado = this.repositorio.actualizarProducto(
      idValido,
      descripcionVo,
      valorVo,
      tamanoVo,
      categoriaVo
    );

    if (!productoActualizado) {
      throw new Error(`No se pudo actualizar el producto con id ${idValido}`);
    }

    return productoActualizado;
  }

  eliminarProducto(id: number): void {
    const idValido = this.validarId(id);

    if (!this.repositorio.eliminarProducto(idValido)) {
      throw new Error(`No se encontró el producto con id ${idValido}`);
    }
  }

  private validarId(id: number): number {
    if (typeof id !== "number" || Number.isNaN(id) || id <= 0) {
      throw new Error("Id de producto inválido");
    }
    return id;
  }
}
