import { ProductoDTO } from "../DTOs/ProductoDTO";
import { IRepositorioProducto } from "../IDataAccess/IRepositorioProducto";
import { IServicioProducto } from "../IServicio/IServicioProducto";

export class ServicioProducto implements IServicioProducto {
  constructor(private repositorio: IRepositorioProducto) {}

  async crearProducto(descripcion: string, valor: number, tamano: number, categoria: string): Promise<ProductoDTO> {
    const descripcionValida = this.validarDescripcion(descripcion);
    const valorValido = this.validarValor(valor);
    const tamanoValido = this.validarTamano(tamano);
    const categoriaValida = this.validarCategoria(categoria);

    const producto = await this.repositorio.crearProducto(descripcionValida, valorValido, tamanoValido, categoriaValida);
    return ProductoDTO.fromEntity(producto);
  }

  async obtenerProductos(): Promise<ProductoDTO[]> {
    const productos = await this.repositorio.obtenerProductos();
    return productos.map(producto => ProductoDTO.fromEntity(producto));
  }

  async obtenerProductoPorId(id: number): Promise<ProductoDTO> {
    const idValido = this.validarId(id);
    const producto = await this.repositorio.obtenerProductoPorId(idValido);

    if (!producto) {
      throw new Error(`No se encontró el producto con id ${idValido}`);
    }

    return ProductoDTO.fromEntity(producto);
  }

  async actualizarProducto(id: number, descripcion: string, valor: number, tamano: number, categoria: string): Promise<ProductoDTO> {
    const idValido = this.validarId(id);
    const descripcionValida = this.validarDescripcion(descripcion);
    const valorValido = this.validarValor(valor);
    const tamanoValido = this.validarTamano(tamano);
    const categoriaValida = this.validarCategoria(categoria);

    if (!await this.repositorio.existe(idValido)) {
      throw new Error(`No se encontró el producto con id ${idValido}`);
    }

    const productoActualizado = await this.repositorio.actualizarProducto(idValido, descripcionValida, valorValido, tamanoValido, categoriaValida);
    if (!productoActualizado) {
      throw new Error(`No se pudo actualizar el producto con id ${idValido}`);
    }

    return ProductoDTO.fromEntity(productoActualizado);
  }

  async eliminarProducto(id: number): Promise<void> {
    const idValido = this.validarId(id);

    if (!await this.repositorio.existe(idValido)) {
      throw new Error(`No se encontró el producto con id ${idValido}`);
    }

    await this.repositorio.eliminarProducto(idValido);
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
