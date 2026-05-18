import { Producto } from "../Dominio/Producto";
import { IRepositorioProducto } from "../IDataAccess/IRepositorioProducto";
import { IServicioProducto } from "../IServicio/IServicioProducto";

export class ServicioProducto implements IServicioProducto {
  constructor(private repositorio: IRepositorioProducto) {}

  crearProducto(descripcion: string, valor: number, tamano: number, categoria: string): Producto {
    const descripcionValida = this.validarDescripcion(descripcion);
    const valorValido = this.validarValor(valor);
    const tamanoValido = this.validarTamano(tamano);
    const categoriaValida = this.validarCategoria(categoria);

    return this.repositorio.crearProducto(descripcionValida, valorValido, tamanoValido, categoriaValida);
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
    const descripcionValida = this.validarDescripcion(descripcion);
    const valorValido = this.validarValor(valor);
    const tamanoValido = this.validarTamano(tamano);
    const categoriaValida = this.validarCategoria(categoria);

    if (!this.repositorio.existe(idValido)) {
      throw new Error(`No se encontró el producto con id ${idValido}`);
    }

    const productoActualizado = this.repositorio.actualizarProducto(idValido, descripcionValida, valorValido, tamanoValido, categoriaValida);
    if (!productoActualizado) {
      throw new Error(`No se pudo actualizar el producto con id ${idValido}`);
    }

    return productoActualizado;
  }

  eliminarProducto(id: number): void {
    const idValido = this.validarId(id);

    if (!this.repositorio.existe(idValido)) {
      throw new Error(`No se encontró el producto con id ${idValido}`);
    } else {
      this.repositorio.eliminarProducto(idValido);
    }
    
  }

  private validarId(id: number): number {
    if (typeof id !== "number" || Number.isNaN(id) || id <= 0) {
      throw new Error("Id de producto inválido");
    }
    return id;
  }

  private validarDescripcion(descripcion: string): string {
    if (!descripcion || descripcion.trim().length === 0) {
      throw new Error("Descripción inválida. Debe contener texto.");
    }
    return descripcion.trim();
  }

  private validarValor(valor: number): number {
    if (typeof valor !== "number" || Number.isNaN(valor) || valor < 0) {
      throw new Error("Valor inválido. Debe ser un número mayor o igual a cero.");
    }
    return valor;
  }

  private validarTamano(tamano: number): number {
    if (typeof tamano !== "number" || Number.isNaN(tamano) || tamano < 0) {
      throw new Error("Tamaño inválido. Debe ser un número mayor o igual a cero.");
    }
    return tamano;
  }

  private validarCategoria(categoria: string): string {
    if (!categoria || categoria.trim().length === 0) {
      throw new Error("Categoría inválida. Debe contener texto.");
    }
    return categoria.trim();
  }
}
